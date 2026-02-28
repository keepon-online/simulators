import type { 
  Component, 
  CircuitDiagram, 
  ComponentType,
  ConnectionPoint 
} from '../types'
import { generateId, createConnectionPoint } from './models'

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

// 创建默认连接点
function createDefaultConnections(type: ComponentType): ConnectionPoint[] {
  switch (type) {
    case 'power':
      return [createConnectionPoint(0, 20), createConnectionPoint(60, 20)]
    case 'switch':
      return [createConnectionPoint(0, 15), createConnectionPoint(50, 15)]
    case 'light':
    case 'outlet':
    case 'resistor':
      return [createConnectionPoint(0, 20), createConnectionPoint(50, 20)]
    case 'circuit_breaker':
    case 'fuse':
      return [createConnectionPoint(0, 15), createConnectionPoint(50, 15)]
    case 'wire':
      return [createConnectionPoint(0, 10), createConnectionPoint(50, 10)]
    case 'refrigerator':
    case 'air_conditioner':
    case 'tv':
    case 'washer':
    case 'water_heater':
      return [createConnectionPoint(30, 40)]
    default:
      return [createConnectionPoint(0, 15), createConnectionPoint(50, 15)]
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

// 从 JSON 导入电路图
export function importCircuitFromJSON(jsonString: string): ParseResult {
  try {
    const data = JSON.parse(jsonString) as CircuitDiagram
    
    if (!data.components || !Array.isArray(data.components)) {
      return {
        success: false,
        errors: ['无效的电路数据: 缺少 components 数组'],
        warnings: [],
      }
    }
    
    const validation = validateCircuitDiagram(data)
    
    return {
      success: validation.isValid,
      diagram: data,
      errors: validation.errors,
      warnings: validation.warnings,
    }
  } catch (error) {
    return {
      success: false,
      errors: ['JSON 解析错误: ' + (error as Error).message],
      warnings: [],
    }
  }
}
