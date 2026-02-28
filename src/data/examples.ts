import type { Component, Wire, CircuitDiagram, ComponentParams, ConnectionPoint } from '../types'
import { BASIC_COMPONENT_PARAMS, APPLIANCE_PARAMS } from '../engine/componentParams'

// ============================================================
// 辅助函数：手动构造元件和导线（不使用 generateId）
// ============================================================

function cp(id: string, x: number, y: number): ConnectionPoint {
  return { id, x, y }
}

function makeComponent(
  id: string,
  type: Component['type'],
  name: string,
  position: { x: number; y: number },
  connections: ConnectionPoint[],
  params: ComponentParams = {},
): Component {
  return {
    id,
    type,
    name,
    position,
    rotation: 0,
    connections,
    params,
    status: 'normal',
    state: { isOn: true, tripped: false, blown: false },
  }
}

function makeWire(
  id: string,
  fromComponentId: string,
  fromPointId: string,
  toComponentId: string,
  toPointId: string,
): Wire {
  return {
    id,
    from: { componentId: fromComponentId, pointId: fromPointId },
    to: { componentId: toComponentId, pointId: toPointId },
  }
}

const ts = '2026-01-01T00:00:00.000Z'

// ============================================================
// 示例 1: 单灯单控
// 电源 → 断路器 → 开关 → 灯（串联回路）
// ============================================================

const ex1Components: Component[] = [
  makeComponent('ex1-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex1-power-in', 0, 20), cp('ex1-power-out', 60, 20)],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex1-breaker', 'circuit_breaker', '断路器', { x: 300, y: 300 },
    [cp('ex1-breaker-in', 0, 15), cp('ex1-breaker-out', 50, 15)],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex1-switch', 'switch', '开关', { x: 500, y: 300 },
    [cp('ex1-switch-in', 0, 15), cp('ex1-switch-out', 50, 15)],
    BASIC_COMPONENT_PARAMS.switch),
  makeComponent('ex1-light', 'light', '灯具', { x: 700, y: 300 },
    [cp('ex1-light-in', 0, 20), cp('ex1-light-out', 50, 20)],
    BASIC_COMPONENT_PARAMS.light),
]

const ex1Wires: Wire[] = [
  makeWire('ex1-w1', 'ex1-power', 'ex1-power-out', 'ex1-breaker', 'ex1-breaker-in'),
  makeWire('ex1-w2', 'ex1-breaker', 'ex1-breaker-out', 'ex1-switch', 'ex1-switch-in'),
  makeWire('ex1-w3', 'ex1-switch', 'ex1-switch-out', 'ex1-light', 'ex1-light-in'),
]


// ============================================================
// 示例 2: 一灯双控（教育简化版：两个开关并联）
// 电源 → 断路器 → 两个开关并联 → 灯
// ============================================================

const ex2Components: Component[] = [
  makeComponent('ex2-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex2-power-in', 0, 20), cp('ex2-power-out', 60, 20)],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex2-breaker', 'circuit_breaker', '断路器', { x: 300, y: 300 },
    [cp('ex2-breaker-in', 0, 15), cp('ex2-breaker-out', 50, 15)],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex2-switch1', 'switch', '开关1', { x: 500, y: 200 },
    [cp('ex2-switch1-in', 0, 15), cp('ex2-switch1-out', 50, 15)],
    BASIC_COMPONENT_PARAMS.switch),
  makeComponent('ex2-switch2', 'switch', '开关2', { x: 500, y: 400 },
    [cp('ex2-switch2-in', 0, 15), cp('ex2-switch2-out', 50, 15)],
    BASIC_COMPONENT_PARAMS.switch),
  makeComponent('ex2-light', 'light', '灯具', { x: 700, y: 300 },
    [cp('ex2-light-in', 0, 20), cp('ex2-light-out', 50, 20)],
    BASIC_COMPONENT_PARAMS.light),
]

const ex2Wires: Wire[] = [
  makeWire('ex2-w1', 'ex2-power', 'ex2-power-out', 'ex2-breaker', 'ex2-breaker-in'),
  makeWire('ex2-w2', 'ex2-breaker', 'ex2-breaker-out', 'ex2-switch1', 'ex2-switch1-in'),
  makeWire('ex2-w3', 'ex2-breaker', 'ex2-breaker-out', 'ex2-switch2', 'ex2-switch2-in'),
  makeWire('ex2-w4', 'ex2-switch1', 'ex2-switch1-out', 'ex2-light', 'ex2-light-in'),
  makeWire('ex2-w5', 'ex2-switch2', 'ex2-switch2-out', 'ex2-light', 'ex2-light-in'),
]

// ============================================================
// 示例 3: 插座回路
// 电源 → 断路器 → 3 个插座并联
// ============================================================

const ex3Components: Component[] = [
  makeComponent('ex3-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex3-power-in', 0, 20), cp('ex3-power-out', 60, 20)],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex3-breaker', 'circuit_breaker', '断路器', { x: 300, y: 300 },
    [cp('ex3-breaker-in', 0, 15), cp('ex3-breaker-out', 50, 15)],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex3-outlet1', 'outlet', '插座1', { x: 550, y: 150 },
    [cp('ex3-outlet1-in', 0, 20), cp('ex3-outlet1-out', 50, 20)],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  makeComponent('ex3-outlet2', 'outlet', '插座2', { x: 550, y: 300 },
    [cp('ex3-outlet2-in', 0, 20), cp('ex3-outlet2-out', 50, 20)],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  makeComponent('ex3-outlet3', 'outlet', '插座3', { x: 550, y: 450 },
    [cp('ex3-outlet3-in', 0, 20), cp('ex3-outlet3-out', 50, 20)],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
]

const ex3Wires: Wire[] = [
  makeWire('ex3-w1', 'ex3-power', 'ex3-power-out', 'ex3-breaker', 'ex3-breaker-in'),
  makeWire('ex3-w2', 'ex3-breaker', 'ex3-breaker-out', 'ex3-outlet1', 'ex3-outlet1-in'),
  makeWire('ex3-w3', 'ex3-breaker', 'ex3-breaker-out', 'ex3-outlet2', 'ex3-outlet2-in'),
  makeWire('ex3-w4', 'ex3-breaker', 'ex3-breaker-out', 'ex3-outlet3', 'ex3-outlet3-in'),
]
// ============================================================
// 示例 4: 厨房回路
// 电源 → 独立断路器 → 冰箱 + 热水器并联
// ============================================================
const ex4Components: Component[] = [
  makeComponent('ex4-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex4-power-in', 0, 20), cp('ex4-power-out', 60, 20)],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex4-breaker', 'circuit_breaker', '厨房断路器', { x: 300, y: 300 },
    [cp('ex4-breaker-in', 0, 15), cp('ex4-breaker-out', 50, 15)],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex4-fridge', 'refrigerator', '冰箱', { x: 550, y: 200 },
    [cp('ex4-fridge-in', 0, 25), cp('ex4-fridge-out', 60, 25)],
    APPLIANCE_PARAMS.refrigerator),
  makeComponent('ex4-heater', 'water_heater', '热水器', { x: 550, y: 420 },
    [cp('ex4-heater-in', 0, 25), cp('ex4-heater-out', 60, 25)],
    APPLIANCE_PARAMS.water_heater),
]
const ex4Wires: Wire[] = [
  makeWire('ex4-w1', 'ex4-power', 'ex4-power-out', 'ex4-breaker', 'ex4-breaker-in'),
  makeWire('ex4-w2', 'ex4-breaker', 'ex4-breaker-out', 'ex4-fridge', 'ex4-fridge-in'),
  makeWire('ex4-w3', 'ex4-breaker', 'ex4-breaker-out', 'ex4-heater', 'ex4-heater-in'),
]
// ============================================================
// 示例 5: 空调专线
// 电源 → 独立断路器(25A) → 空调
// ============================================================
const ex5Components: Component[] = [
  makeComponent('ex5-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex5-power-in', 0, 20), cp('ex5-power-out', 60, 20)],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex5-breaker', 'circuit_breaker', '空调断路器(25A)', { x: 350, y: 300 },
    [cp('ex5-breaker-in', 0, 15), cp('ex5-breaker-out', 50, 15)],
    { ...BASIC_COMPONENT_PARAMS.circuit_breaker, maxCurrent: 25 }),
  makeComponent('ex5-ac', 'air_conditioner', '空调', { x: 600, y: 300 },
    [cp('ex5-ac-in', 0, 25), cp('ex5-ac-out', 60, 25)],
    APPLIANCE_PARAMS.air_conditioner),
]
const ex5Wires: Wire[] = [
  makeWire('ex5-w1', 'ex5-power', 'ex5-power-out', 'ex5-breaker', 'ex5-breaker-in'),
  makeWire('ex5-w2', 'ex5-breaker', 'ex5-breaker-out', 'ex5-ac', 'ex5-ac-in'),
]
// ============================================================
// 示例 6: 全屋配电
// 电源 → 总断路器 → 4个分支回路
//   照明分支：开关+灯
//   插座分支：3个插座
//   空调分支：空调
//   厨房分支：冰箱+热水器
// ============================================================
const ex6Components: Component[] = [
  // 主干
  makeComponent('ex6-power', 'power', '总电源', { x: 50, y: 350 },
    [cp('ex6-power-in', 0, 20), cp('ex6-power-out', 60, 20)],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex6-main-breaker', 'circuit_breaker', '总断路器', { x: 200, y: 350 },
    [cp('ex6-mb-in', 0, 15), cp('ex6-mb-out', 50, 15)],
    { ...BASIC_COMPONENT_PARAMS.circuit_breaker, maxCurrent: 63 }),
  // 照明分支
  makeComponent('ex6-light-switch', 'switch', '照明开关', { x: 450, y: 100 },
    [cp('ex6-ls-in', 0, 15), cp('ex6-ls-out', 50, 15)],
    BASIC_COMPONENT_PARAMS.switch),
  makeComponent('ex6-light', 'light', '客厅灯', { x: 650, y: 100 },
    [cp('ex6-light-in', 0, 20), cp('ex6-light-out', 50, 20)],
    BASIC_COMPONENT_PARAMS.light),
  // 插座分支
  makeComponent('ex6-outlet1', 'outlet', '插座1', { x: 450, y: 250 },
    [cp('ex6-o1-in', 0, 20), cp('ex6-o1-out', 50, 20)],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  makeComponent('ex6-outlet2', 'outlet', '插座2', { x: 650, y: 250 },
    [cp('ex6-o2-in', 0, 20), cp('ex6-o2-out', 50, 20)],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  makeComponent('ex6-outlet3', 'outlet', '插座3', { x: 850, y: 250 },
    [cp('ex6-o3-in', 0, 20), cp('ex6-o3-out', 50, 20)],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  // 空调分支
  makeComponent('ex6-ac', 'air_conditioner', '空调', { x: 450, y: 420 },
    [cp('ex6-ac-in', 0, 25), cp('ex6-ac-out', 60, 25)],
    APPLIANCE_PARAMS.air_conditioner),
  // 厨房分支
  makeComponent('ex6-fridge', 'refrigerator', '冰箱', { x: 450, y: 570 },
    [cp('ex6-fridge-in', 0, 25), cp('ex6-fridge-out', 60, 25)],
    APPLIANCE_PARAMS.refrigerator),
  makeComponent('ex6-heater', 'water_heater', '热水器', { x: 700, y: 570 },
    [cp('ex6-heater-in', 0, 25), cp('ex6-heater-out', 60, 25)],
    APPLIANCE_PARAMS.water_heater),
]
const ex6Wires: Wire[] = [
  // 主干
  makeWire('ex6-w1', 'ex6-power', 'ex6-power-out', 'ex6-main-breaker', 'ex6-mb-in'),
  // 照明分支
  makeWire('ex6-w2', 'ex6-main-breaker', 'ex6-mb-out', 'ex6-light-switch', 'ex6-ls-in'),
  makeWire('ex6-w3', 'ex6-light-switch', 'ex6-ls-out', 'ex6-light', 'ex6-light-in'),
  // 插座分支
  makeWire('ex6-w4', 'ex6-main-breaker', 'ex6-mb-out', 'ex6-outlet1', 'ex6-o1-in'),
  makeWire('ex6-w5', 'ex6-main-breaker', 'ex6-mb-out', 'ex6-outlet2', 'ex6-o2-in'),
  makeWire('ex6-w6', 'ex6-main-breaker', 'ex6-mb-out', 'ex6-outlet3', 'ex6-o3-in'),
  // 空调分支
  makeWire('ex6-w7', 'ex6-main-breaker', 'ex6-mb-out', 'ex6-ac', 'ex6-ac-in'),
  // 厨房分支
  makeWire('ex6-w8', 'ex6-main-breaker', 'ex6-mb-out', 'ex6-fridge', 'ex6-fridge-in'),
  makeWire('ex6-w9', 'ex6-main-breaker', 'ex6-mb-out', 'ex6-heater', 'ex6-heater-in'),
]

// ============================================================
// 导出所有示例
// ============================================================

function makeDiagram(id: string, name: string, components: Component[], wires: Wire[]): CircuitDiagram {
  return { id, name, components, wires, createdAt: ts, updatedAt: ts }
}

export const singleLightSwitch = makeDiagram('ex1', '单灯单控', ex1Components, ex1Wires)
export const dualSwitchLight = makeDiagram('ex2', '一灯双控', ex2Components, ex2Wires)
export const outletCircuit = makeDiagram('ex3', '插座回路', ex3Components, ex3Wires)
export const kitchenCircuit = makeDiagram('ex4', '厨房回路', ex4Components, ex4Wires)
export const acDedicatedLine = makeDiagram('ex5', '空调专线', ex5Components, ex5Wires)
export const wholeHouseDistribution = makeDiagram('ex6', '全屋配电', ex6Components, ex6Wires)

export const CIRCUIT_EXAMPLES: Array<{ name: string; description: string; diagram: CircuitDiagram }> = [
  {
    name: '单灯单控',
    description: '最基本的家庭照明回路：电源 → 断路器 → 开关 → 灯',
    diagram: singleLightSwitch,
  },
  {
    name: '一灯双控',
    description: '教育简化版双控照明：两个开关并联控制同一盏灯',
    diagram: dualSwitchLight,
  },
  {
    name: '插座回路',
    description: '常见插座回路：断路器保护下的3个并联插座',
    diagram: outletCircuit,
  },
  {
    name: '厨房回路',
    description: '厨房大功率电器回路：冰箱和热水器并联',
    diagram: kitchenCircuit,
  },
  {
    name: '空调专线',
    description: '空调独立回路：25A断路器保护的大功率专线',
    diagram: acDedicatedLine,
  },
  {
    name: '全屋配电',
    description: '完整家庭配电系统：总断路器下分照明、插座、空调、厨房4个分支',
    diagram: wholeHouseDistribution,
  },
]