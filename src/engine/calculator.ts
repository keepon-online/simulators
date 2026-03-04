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

type ComponentTree = Map<string, string[]>

const NON_LOAD_COMPONENT_TYPES = new Set<Component['type']>([
  'power',
  'switch',
  'dual_switch',
  'circuit_breaker',
  'fuse',
  'wire',
])

function isLoadComponent(component: Component): boolean {
  return !NON_LOAD_COMPONENT_TYPES.has(component.type)
}

function isPositiveFiniteResistance(resistance: number): boolean {
  return Number.isFinite(resistance) && resistance > 0
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

function buildConductingTree(
  powerSourceId: string,
  adjacencyList: AdjacencyList,
  componentMap: Map<string, Component>
): ComponentTree {
  const tree: ComponentTree = new Map()
  const visited = new Set<string>([powerSourceId])
  const queue: string[] = [powerSourceId]

  while (queue.length > 0) {
    const currentId = queue.shift() as string
    const neighbors = adjacencyList[currentId] || []
    const children: string[] = []

    neighbors.forEach(neighborId => {
      if (visited.has(neighborId)) {
        return
      }

      const neighbor = componentMap.get(neighborId)
      if (!neighbor) {
        return
      }

      if (!isComponentConducting(neighbor)) {
        return
      }

      visited.add(neighborId)
      children.push(neighborId)
      queue.push(neighborId)
    })

    tree.set(currentId, children)
  }

  return tree
}

// 使用BFS查找从电源到目标元件的路径
function findPath(
  adjacencyList: AdjacencyList,
  startId: string,
  endId: string
): string[] | null {
  if (startId === endId) {
    return [startId]
  }

  const queue: string[] = [startId]
  const visited = new Set<string>([startId])
  const parentMap = new Map<string, string>()

  while (queue.length > 0) {
    const currentId = queue.shift() as string
    const neighbors = adjacencyList[currentId] || []

    for (const neighborId of neighbors) {
      if (visited.has(neighborId)) {
        continue
      }

      visited.add(neighborId)
      parentMap.set(neighborId, currentId)

      if (neighborId === endId) {
        const path: string[] = [endId]
        let cursor = endId

        while (cursor !== startId) {
          const parent = parentMap.get(cursor)
          if (!parent) {
            break
          }
          path.unshift(parent)
          cursor = parent
        }

        return path
      }

      queue.push(neighborId)
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

  const componentMap = new Map<string, Component>(
    diagram.components.map(component => [component.id, component])
  )
  const adjacencyList = buildAdjacencyList(diagram)
  const conductingTree = buildConductingTree(powerSource.id, adjacencyList, componentMap)

  diagram.components.forEach(component => {
    const conducting = component.id === powerSource.id || isComponentConducting(component)
    const resistance = conducting ? getComponentResistance(component) : Infinity

    electricalValues.set(component.id, {
      voltage: 0,
      current: 0,
      power: 0,
      resistance,
    })
  })

  const equivalentResistanceCache = new Map<string, number>()

  const calculateEquivalentResistance = (componentId: string): number => {
    const cached = equivalentResistanceCache.get(componentId)
    if (cached !== undefined) {
      return cached
    }

    const component = componentMap.get(componentId)
    if (!component) {
      equivalentResistanceCache.set(componentId, Infinity)
      return Infinity
    }

    const ownResistance = component.type === 'power' ? 0 : getComponentResistance(component)
    const childIds = conductingTree.get(componentId) || []

    if (childIds.length === 0) {
      const leafResistance = isLoadComponent(component) ? ownResistance : Infinity
      equivalentResistanceCache.set(componentId, leafResistance)
      return leafResistance
    }

    const childEquivalentResistances = childIds
      .map(childId => calculateEquivalentResistance(childId))
      .filter(isPositiveFiniteResistance)

    if (childEquivalentResistances.length === 0) {
      equivalentResistanceCache.set(componentId, Infinity)
      return Infinity
    }

    const downstreamResistance = childEquivalentResistances.length === 1
      ? childEquivalentResistances[0]
      : calculateParallelResistance(childEquivalentResistances)

    const equivalentResistance = ownResistance + downstreamResistance
    equivalentResistanceCache.set(componentId, equivalentResistance)
    return equivalentResistance
  }

  const totalEquivalentResistance = calculateEquivalentResistance(powerSource.id)
  const totalCurrent = isPositiveFiniteResistance(totalEquivalentResistance)
    ? HOUSEHOLD_VOLTAGE / totalEquivalentResistance
    : 0

  const distributeCurrent = (componentId: string, componentCurrent: number) => {
    const component = componentMap.get(componentId)
    if (!component) {
      return
    }

    if (component.type === 'power') {
      electricalValues.set(componentId, {
        voltage: HOUSEHOLD_VOLTAGE,
        current: componentCurrent,
        power: HOUSEHOLD_VOLTAGE * componentCurrent,
        resistance: totalEquivalentResistance,
      })
    } else {
      const componentResistance = getComponentResistance(component)
      const voltage = isPositiveFiniteResistance(componentResistance)
        ? componentCurrent * componentResistance
        : 0
      electricalValues.set(componentId, {
        voltage,
        current: componentCurrent,
        power: voltage * componentCurrent,
        resistance: componentResistance,
      })
    }

    const childIds = conductingTree.get(componentId) || []
    if (childIds.length === 0 || componentCurrent <= 0) {
      return
    }

    const branchResistances = childIds
      .map(childId => ({
        childId,
        resistance: equivalentResistanceCache.get(childId) ?? Infinity,
      }))
      .filter(branch => isPositiveFiniteResistance(branch.resistance))

    if (branchResistances.length === 0) {
      return
    }

    if (branchResistances.length === 1) {
      distributeCurrent(branchResistances[0].childId, componentCurrent)
      return
    }

    const totalConductance = branchResistances.reduce(
      (sum, branch) => sum + 1 / branch.resistance,
      0
    )

    branchResistances.forEach(branch => {
      const branchCurrent = componentCurrent * ((1 / branch.resistance) / totalConductance)
      distributeCurrent(branch.childId, branchCurrent)
    })
  }

  distributeCurrent(powerSource.id, totalCurrent)

  const totalPower = electricalValues.get(powerSource.id)?.power ?? 0
  
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
