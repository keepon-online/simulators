import type { 
  Component, 
  CircuitDiagram, 
  ComponentType,
} from '../types'
import { generateId, createDefaultConnections } from './models'

// SVG 元素类型
interface SVGElement {
  type: string
  id?: string
  'data-component-id'?: string
  'data-component-type'?: string
  'data-x'?: string
  'data-y'?: string
  x1?: string | number
  y1?: string | number
  x2?: string | number
  y2?: string | number
  points?: string
  transform?: string
}

// SVG 解析结果
export interface ParseResult {
  success: boolean
  diagram?: CircuitDiagram
  errors: string[]
  warnings: string[]
}

export const STORAGE_SCHEMA = 'home-circuit-simulator'
export const STORAGE_SCHEMA_VERSION = 1

interface CircuitStoragePayload {
  schema: string
  version: number
  savedAt: string
  diagram: CircuitDiagram
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// 从组件类型获取默认名称
function getDefaultName(type: ComponentType): string {
  const names: Record<ComponentType, string> = {
    power: '电源',
    switch: '开关',
    light: '灯具',
    outlet: '插座',
    circuit_breaker: '断路器',
    fuse: '保险丝',
    wire: '导线',
    resistor: '电阻',
    refrigerator: '冰箱',
    air_conditioner: '空调',
    tv: '电视',
    washer: '洗衣机',
    water_heater: '热水器',
    outlet_5hole: '五孔插座',
    dual_switch: '双联双控开关',
  }
  return names[type] || '未知元件'
}

// 解析 SVG 元素为组件
export function parseSVGElement(element: SVGElement): Component | null {
  const componentType = element['data-component-type'] as ComponentType
  
  if (!componentType) {
    return null
  }
  
  const x = parseFloat(element['data-x'] || '0')
  const y = parseFloat(element['data-y'] || '0')
  
  return {
    id: element['data-component-id'] || generateId(),
    type: componentType,
    name: getDefaultName(componentType),
    position: { x, y },
    rotation: 0,
    connections: createDefaultConnections(componentType),
    params: {},
    status: 'normal',
    state: { isOn: true },
  }
}


// 验证电路图完整性
export function validateCircuitDiagram(diagram: CircuitDiagram): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  const hasPower = diagram.components.some(c => c.type === 'power')
  if (!hasPower) {
    errors.push('电路图中没有电源')
  }
  
  const connectedComponents = new Set<string>()
  
  diagram.wires.forEach(wire => {
    connectedComponents.add(wire.from.componentId)
    connectedComponents.add(wire.to.componentId)
  })
  
  diagram.components.forEach(component => {
    if (component.type === 'power' || component.type === 'wire') {
      return
    }
    
    if (!connectedComponents.has(component.id)) {
      warnings.push(`元件 "${component.name}" (ID: ${component.id}) 未连接到任何导线`)
    }
  })
  
  diagram.wires.forEach(wire => {
    const fromExists = diagram.components.some(c => c.id === wire.from.componentId)
    const toExists = diagram.components.some(c => c.id === wire.to.componentId)
    
    if (!fromExists) {
      errors.push(`导线连接到了不存在的元件 (from: ${wire.from.componentId})`)
    }
    if (!toExists) {
      errors.push(`导线连接到了不存在的元件 (to: ${wire.to.componentId})`)
    }
  })
  
  const ids = diagram.components.map(c => c.id)
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicateIds.length > 0) {
    errors.push(`发现重复的元件ID: ${duplicateIds.join(', ')}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// 从 SVG 字符串解析电路图
export function parseCircuitFromSVG(svgString: string): ParseResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgString, 'image/svg+xml')
    
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      return {
        success: false,
        errors: ['SVG 解析错误: ' + parseError.textContent],
        warnings: [],
      }
    }
    
    const componentElements = doc.querySelectorAll('[data-component-type]')
    const components: Component[] = []
    
    componentElements.forEach(el => {
      const element = el as unknown as SVGElement
      const component = parseSVGElement(element)
      if (component) {
        components.push(component)
      }
    })
    
    const wireElements = doc.querySelectorAll('[data-wire]')
    const wires: { from: { componentId: string; pointId: string }; to: { componentId: string; pointId: string } }[] = []
    
    wireElements.forEach(el => {
      const fromId = el.getAttribute('data-from-component')
      const toId = el.getAttribute('data-to-component')
      
      if (fromId && toId) {
        wires.push({
          from: { componentId: fromId, pointId: '' },
          to: { componentId: toId, pointId: '' },
        })
      }
    })
    
    const diagram: CircuitDiagram = {
      id: generateId(),
      name: 'Imported Circuit',
      components,
      wires: wires.map(w => ({
        id: generateId(),
        from: w.from,
        to: w.to,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const validation = validateCircuitDiagram(diagram)
    errors.push(...validation.errors)
    warnings.push(...validation.warnings)
    
    return {
      success: validation.isValid,
      diagram,
      errors,
      warnings,
    }
  } catch (error) {
    return {
      success: false,
      errors: ['解析异常: ' + (error as Error).message],
      warnings: [],
    }
  }
}

// 导出电路图为 JSON
export function exportCircuitToJSON(diagram: CircuitDiagram): string {
  return JSON.stringify(diagram, null, 2)
}

// 导出电路图为带版本信息的存档 JSON
export function exportCircuitToStorageJSON(diagram: CircuitDiagram): string {
  const payload: CircuitStoragePayload = {
    schema: STORAGE_SCHEMA,
    version: STORAGE_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    diagram,
  }

  return JSON.stringify(payload)
}

function extractDiagramFromImportData(data: unknown): {
  diagram?: CircuitDiagram
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (!isObjectRecord(data)) {
    return {
      errors: ['无效的电路数据: 顶层必须是对象'],
      warnings,
    }
  }

  const maybeStoragePayload = 'diagram' in data || 'version' in data || 'schema' in data

  let diagramCandidate: unknown = data
  if (maybeStoragePayload) {
    const schema = data.schema
    const version = data.version

    if (typeof schema !== 'string' || schema !== STORAGE_SCHEMA) {
      errors.push('无效的存档格式: schema 不匹配')
      return { errors, warnings }
    }

    if (typeof version !== 'number' || !Number.isFinite(version)) {
      errors.push('无效的存档版本: 缺少或非法 version 字段')
      return { errors, warnings }
    }

    if (version > STORAGE_SCHEMA_VERSION) {
      errors.push(`存档版本过高: v${version}，当前仅支持 v${STORAGE_SCHEMA_VERSION}`)
      return { errors, warnings }
    }

    if (version < STORAGE_SCHEMA_VERSION) {
      warnings.push(`检测到旧版存档 v${version}，已按兼容模式导入`)
    }

    diagramCandidate = data.diagram
  } else {
    warnings.push('检测到旧版存档（无版本信息），已按兼容模式加载')
  }

  if (!isObjectRecord(diagramCandidate)) {
    errors.push('无效的电路数据: 缺少 diagram 对象')
    return { errors, warnings }
  }

  if (!Array.isArray(diagramCandidate.components)) {
    errors.push('无效的电路数据: 缺少 components 数组')
    return { errors, warnings }
  }

  if (!Array.isArray(diagramCandidate.wires)) {
    errors.push('无效的电路数据: 缺少 wires 数组')
    return { errors, warnings }
  }

  return {
    diagram: diagramCandidate as unknown as CircuitDiagram,
    errors,
    warnings,
  }
}

// 从 JSON 导入电路图
export function importCircuitFromJSON(jsonString: string): ParseResult {
  try {
    const data = JSON.parse(jsonString) as unknown

    const extracted = extractDiagramFromImportData(data)
    if (!extracted.diagram) {
      return {
        success: false,
        errors: extracted.errors,
        warnings: extracted.warnings,
      }
    }

    const validation = validateCircuitDiagram(extracted.diagram)
    
    return {
      success: validation.isValid,
      diagram: extracted.diagram,
      errors: validation.errors,
      warnings: [...extracted.warnings, ...validation.warnings],
    }
  } catch (error) {
    return {
      success: false,
      errors: ['JSON 解析错误: ' + (error as Error).message],
      warnings: [],
    }
  }
}

// 从存档 JSON 导入电路图（与 importCircuitFromJSON 行为一致）
export function importCircuitFromStorageJSON(jsonString: string): ParseResult {
  return importCircuitFromJSON(jsonString)
}
