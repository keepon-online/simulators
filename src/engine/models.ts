import type {
  Component,
  ComponentParams,
  ComponentState,
  ComponentType,
  ConnectionPoint,
  Wire,
  CircuitDiagram,
} from '@/types'

// 生成唯一ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 创建基础连接点
export function createConnectionPoint(x: number, y: number, label?: string): ConnectionPoint {
  const point: ConnectionPoint = {
    id: generateId(),
    x,
    y,
  }
  if (label !== undefined) {
    point.label = label
  }
  return point
}

// 创建默认元件状态
export function createDefaultComponentState(): ComponentState {
  return {
    isOn: true,
    tripped: false,
    blown: false,
    isOn2: true,
  }
}

// 创建元件
export function createComponent(
  type: ComponentType,
  name: string,
  position: { x: number; y: number },
  params: ComponentParams = {}
): Component {
  const connections = createDefaultConnections(type)
  
  return {
    id: generateId(),
    type,
    name,
    position,
    rotation: 0,
    connections,
    params,
    status: 'normal',
    state: createDefaultComponentState(),
  }
}

// 创建默认连接点（根据元件类型）
export function createDefaultConnections(type: ComponentType): ConnectionPoint[] {
  switch (type) {
    case 'power':
      // 电源：左N右L
      return [
        createConnectionPoint(0, 20, 'N'),
        createConnectionPoint(60, 20, 'L'),
      ]
    case 'switch':
      // 开关：串在火线上，两端都是L
      return [
        createConnectionPoint(0, 15, 'L'),
        createConnectionPoint(50, 15, 'L'),
      ]
    case 'light':
    case 'outlet':
    case 'resistor':
      // 负载：左L右N
      return [
        createConnectionPoint(0, 20, 'L'),
        createConnectionPoint(50, 20, 'N'),
      ]
    case 'circuit_breaker':
    case 'fuse':
      // 保护器件：串在火线上，两端都是L
      return [
        createConnectionPoint(0, 15, 'L'),
        createConnectionPoint(50, 15, 'L'),
      ]
    case 'wire':
      // 导线：两点，无label
      return [
        createConnectionPoint(0, 10),
        createConnectionPoint(50, 10),
      ]
    case 'outlet_5hole':
      // 五孔插座：L, N, E（地线）
      return [
        createConnectionPoint(0, 20, 'L'),
        createConnectionPoint(50, 20, 'N'),
        createConnectionPoint(25, 0, 'E'),
      ]
    case 'dual_switch':
      // 双联开关：4个连接点，两组L1/L2
      return [
        createConnectionPoint(0, 10, 'L1'),
        createConnectionPoint(60, 10, 'L1'),
        createConnectionPoint(0, 30, 'L2'),
        createConnectionPoint(60, 30, 'L2'),
      ]
    case 'refrigerator':
    case 'air_conditioner':
    case 'tv':
    case 'washer':
    case 'water_heater':
      // 家电：左L右N
      return [
        createConnectionPoint(0, 25, 'L'),
        createConnectionPoint(60, 25, 'N'),
      ]
    default:
      return [
        createConnectionPoint(0, 15),
        createConnectionPoint(50, 15),
      ]
  }
}

// 创建导线
export function createWire(
  fromComponentId: string,
  fromPointId: string,
  toComponentId: string,
  toPointId: string,
  points?: { x: number; y: number }[]
): Wire {
  return {
    id: generateId(),
    from: {
      componentId: fromComponentId,
      pointId: fromPointId,
    },
    to: {
      componentId: toComponentId,
      pointId: toPointId,
    },
    points,
  }
}

// 创建电路图
export function createCircuitDiagram(name: string = 'New Circuit'): CircuitDiagram {
  return {
    id: generateId(),
    name,
    components: [],
    wires: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// 添加元件到电路图
export function addComponent(
  diagram: CircuitDiagram,
  component: Component
): CircuitDiagram {
  return {
    ...diagram,
    components: [...diagram.components, component],
    updatedAt: new Date().toISOString(),
  }
}

// 从电路图删除元件
export function removeComponent(
  diagram: CircuitDiagram,
  componentId: string
): CircuitDiagram {
  return {
    ...diagram,
    components: diagram.components.filter(c => c.id !== componentId),
    wires: diagram.wires.filter(
      w => w.from.componentId !== componentId && w.to.componentId !== componentId
    ),
    updatedAt: new Date().toISOString(),
  }
}

// 添加导线到电路图
export function addWire(
  diagram: CircuitDiagram,
  wire: Wire
): CircuitDiagram {
  return {
    ...diagram,
    wires: [...diagram.wires, wire],
    updatedAt: new Date().toISOString(),
  }
}

// 从电路图删除导线
export function removeWire(
  diagram: CircuitDiagram,
  wireId: string
): CircuitDiagram {
  return {
    ...diagram,
    wires: diagram.wires.filter(w => w.id !== wireId),
    updatedAt: new Date().toISOString(),
  }
}

// 更新元件位置
export function updateComponentPosition(
  diagram: CircuitDiagram,
  componentId: string,
  position: { x: number; y: number }
): CircuitDiagram {
  return {
    ...diagram,
    components: diagram.components.map(c =>
      c.id === componentId ? { ...c, position } : c
    ),
    updatedAt: new Date().toISOString(),
  }
}

// 更新元件状态
export function updateComponentState(
  diagram: CircuitDiagram,
  componentId: string,
  state: Partial<ComponentState>
): CircuitDiagram {
  return {
    ...diagram,
    components: diagram.components.map(c =>
      c.id === componentId ? { ...c, state: { ...c.state, ...state } } : c
    ),
    updatedAt: new Date().toISOString(),
  }
}

// 切换开关状态
export function toggleSwitch(
  diagram: CircuitDiagram,
  componentId: string,
  groupIndex: 1 | 2 = 1
): CircuitDiagram {
  const component = diagram.components.find(c => c.id === componentId)
  if (!component || (component.type !== 'switch' && component.type !== 'dual_switch')) {
    return diagram
  }
  
  const stateKey = groupIndex === 2 ? 'isOn2' : 'isOn'
  
  return {
    ...diagram,
    components: diagram.components.map(c =>
      c.id === componentId
        ? { ...c, state: { ...c.state, [stateKey]: !c.state[stateKey] } }
        : c
    ),
    updatedAt: new Date().toISOString(),
  }
}

// 获取元件
export function getComponent(
  diagram: CircuitDiagram,
  componentId: string
): Component | undefined {
  return diagram.components.find(c => c.id === componentId)
}

// 获取连接到指定元件的所有导线
export function getWiresForComponent(
  diagram: CircuitDiagram,
  componentId: string
): Wire[] {
  return diagram.wires.filter(
    w => w.from.componentId === componentId || w.to.componentId === componentId
  )
}
