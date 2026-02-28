import type {
  Component,
  CircuitDiagram,
  ElectricalValues,
  CircuitState,
  CalculationResult,
  FaultDetection,
} from '../types'
import { getComponent } from './models'

// 家庭电路标准电压 (V)
export const HOUSEHOLD_VOLTAGE = 220

// 短路电阻阈值 (Ω) - 低于此值视为短路
export const SHORT_CIRCUIT_THRESHOLD = 0.1

// 计算欧姆定律: V = I × R
export function calculateOhmLaw(voltage: number, resistance: number): ElectricalValues {
  const current = resistance > 0 ? voltage / resistance : 0
  const power = voltage * current
  
  return {
    voltage,
    current,
    power,
    resistance,
  }
}

// 计算功率: P = V × I
export function calculatePower(voltage: number, current: number): ElectricalValues {
  const resistance = current > 0 ? voltage / current : 0
  const power = voltage * current
  
  return {
    voltage,
    current,
    power,
    resistance,
  }
}

// 计算并联电阻: 1/R = 1/R1 + 1/R2 + ...
export function calculateParallelResistance(resistances: number[]): number {
  const validResistances = resistances.filter(r => r > 0)
  if (validResistances.length === 0) return 0
  
  const reciprocalSum = validResistances.reduce((sum, r) => sum + 1 / r, 0)
  return reciprocalSum > 0 ? 1 / reciprocalSum : 0
}

// 计算串联电阻: R = R1 + R2 + ...
export function calculateSeriesResistance(resistances: number[]): number {
  return resistances.reduce((sum, r) => sum + r, 0)
}

// 根据元件类型获取电阻
export function getComponentResistance(component: Component): number {
  const { type, params, state } = component
  
  if (params.resistance !== undefined && params.resistance > 0) {
    return params.resistance
  }
  
  if (params.power !== undefined && params.power > 0 && params.voltage !== undefined) {
    return (params.voltage * params.voltage) / params.power
  }
  
  switch (type) {
    case 'power':
      return 0
    case 'switch':
      return state.isOn ? 0.01 : Infinity
    case 'dual_switch':
      return state.isOn ? 0.01 : Infinity
    case 'circuit_breaker':
      return 0.01
    case 'fuse':
      return 0.05
    case 'wire':
      return 0.1
    case 'light':
      return params.power ? (HOUSEHOLD_VOLTAGE * HOUSEHOLD_VOLTAGE) / params.power : 806.67
    case 'outlet':
      return Infinity
    case 'outlet_5hole':
      return Infinity
    case 'resistor':
      return params.resistance || 100
    case 'refrigerator':
      return params.power ? (HOUSEHOLD_VOLTAGE * HOUSEHOLD_VOLTAGE) / params.power : 40.67
    case 'air_conditioner':
      return params.power ? (HOUSEHOLD_VOLTAGE * HOUSEHOLD_VOLTAGE) / params.power : 16.13
    case 'tv':
      return params.power ? (HOUSEHOLD_VOLTAGE * HOUSEHOLD_VOLTAGE) / params.power : 80
    case 'washer':
      return params.power ? (HOUSEHOLD_VOLTAGE * HOUSEHOLD_VOLTAGE) / params.power : 48.89
    case 'water_heater':
      return params.power ? (HOUSEHOLD_VOLTAGE * HOUSEHOLD_VOLTAGE) / params.power : 24.44
    default:
      return Infinity
  }
}

// 检查元件是否导通
export function isComponentConducting(component: Component): boolean {
  const { type, state } = component
  
  switch (type) {
    case 'switch':
      return state.isOn
    case 'dual_switch':
      return state.isOn
    case 'circuit_breaker':
      return !state.tripped
    case 'fuse':
      return !state.blown
    default:
      return true
  }
}

// 构建电路邻接表
interface AdjacencyList {
  [componentId: string]: string[]
}

function buildAdjacencyList(diagram: CircuitDiagram): AdjacencyList {
  const adjacencyList: AdjacencyList = {}
  
  diagram.components.forEach(comp => {
    adjacencyList[comp.id] = []
  })
  
  diagram.wires.forEach(wire => {
    const fromId = wire.from.componentId
    const toId = wire.to.componentId
    
    if (adjacencyList[fromId] && adjacencyList[toId]) {
      adjacencyList[fromId].push(toId)
      adjacencyList[toId].push(fromId)
    }
  })
  
  return adjacencyList
}

// 使用BFS查找从电源到目标元件的路径
function findPath(
  adjacencyList: AdjacencyList,
  startId: string,
  endId: string,
  visited: Set<string> = new Set()
): string[] | null {
  if (startId === endId) {
    return [startId]
  }
  
  visited.add(startId)
  
  const neighbors = adjacencyList[startId] || []
  
  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      const path = findPath(adjacencyList, neighbor, endId, visited)
      if (path) {
        return [startId, ...path]
      }
    }
  }
  
  return null
}

// 计算电路状态
export function calculateCircuitState(diagram: CircuitDiagram): CircuitState {
  const electricalValues = new Map<string, ElectricalValues>()
  const faults: FaultDetection[] = []
  
  const powerSource = diagram.components.find(c => c.type === 'power')
  
  if (!powerSource) {
    return {
      diagram,
      electricalValues,
      faults: [{
        type: 'open_circuit',
        message: '电路中没有电源',
        severity: 'error',
      }],
      totalPower: 0,
      totalCurrent: 0,
      isValid: false,
    }
  }
  
  const loadComponents = diagram.components.filter(c => 
    c.type !== 'power' && 
    c.type !== 'switch' && 
    c.type !== 'circuit_breaker' &&
    c.type !== 'fuse' &&
    c.type !== 'wire'
  )
  
  let totalCurrent = 0
  let totalPower = 0
  
  loadComponents.forEach(component => {
    if (!isComponentConducting(component)) {
      electricalValues.set(component.id, {
        voltage: 0,
        current: 0,
        power: 0,
        resistance: Infinity,
      })
      return
    }
    
    const resistance = getComponentResistance(component)
    const values = calculateOhmLaw(HOUSEHOLD_VOLTAGE, resistance)
    electricalValues.set(component.id, values)
    
    totalCurrent += values.current
    totalPower += values.power
  })
  
  const powerValues = {
    voltage: HOUSEHOLD_VOLTAGE,
    current: totalCurrent,
    power: totalPower,
    resistance: totalCurrent > 0 ? HOUSEHOLD_VOLTAGE / totalCurrent : Infinity,
  }
  electricalValues.set(powerSource.id, powerValues)
  
  return {
    diagram,
    electricalValues,
    faults,
    totalPower,
    totalCurrent,
    isValid: true,
  }
}

// 计算单个元件的电气值
export function calculateComponentValues(
  diagram: CircuitDiagram,
  componentId: string
): CalculationResult | null {
  const component = getComponent(diagram, componentId)
  if (!component) return null
  
  const powerSource = diagram.components.find(c => c.type === 'power')
  if (!powerSource) return null
  
  const adjacencyList = buildAdjacencyList(diagram)
  const path = findPath(adjacencyList, powerSource.id, componentId)
  
  if (!path) {
    return null
  }
  
  const resistances: number[] = []
  
  path.forEach(compId => {
    const comp = getComponent(diagram, compId)
    if (comp && comp.type !== 'power') {
      resistances.push(getComponentResistance(comp))
    }
  })
  
  const equivalentResistance = calculateSeriesResistance(resistances)
  const values = calculateOhmLaw(HOUSEHOLD_VOLTAGE, equivalentResistance)
  
  return {
    componentId,
    values,
    path,
  }
}
