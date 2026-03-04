import type { Component, Wire, CircuitDiagram, ComponentParams, ConnectionPoint, CircuitExampleWithSteps } from '../types'
import { BASIC_COMPONENT_PARAMS, APPLIANCE_PARAMS } from '../engine/componentParams'

// ============================================================
// 辅助函数：手动构造元件和导线（不使用 generateId）
// ============================================================

function cp(id: string, x: number, y: number, label?: string): ConnectionPoint {
  const point: ConnectionPoint = { id, x, y }
  if (label !== undefined) {
    point.label = label
  }
  return point
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
    [cp('ex1-power-in', 0, 20, 'N'), cp('ex1-power-out', 60, 20, 'L')],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex1-breaker', 'circuit_breaker', '断路器', { x: 300, y: 300 },
    [cp('ex1-breaker-in', 0, 15, 'L'), cp('ex1-breaker-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex1-switch', 'switch', '开关', { x: 500, y: 300 },
    [cp('ex1-switch-in', 0, 15, 'L'), cp('ex1-switch-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.switch),
  makeComponent('ex1-light', 'light', '灯具', { x: 700, y: 300 },
    [cp('ex1-light-in', 0, 20, 'L'), cp('ex1-light-out', 50, 20, 'N')],
    BASIC_COMPONENT_PARAMS.light),
]

const ex1Wires: Wire[] = [
  makeWire('ex1-w1', 'ex1-power', 'ex1-power-out', 'ex1-breaker', 'ex1-breaker-in'),
  makeWire('ex1-w2', 'ex1-breaker', 'ex1-breaker-out', 'ex1-switch', 'ex1-switch-in'),
  makeWire('ex1-w3', 'ex1-switch', 'ex1-switch-out', 'ex1-light', 'ex1-light-in'),
]


// ============================================================
// 示例 2: 双控照明（教育简化版：两个开关并联）
// 电源 → 断路器 → 两个开关并联 → 灯
// ============================================================

const ex2Components: Component[] = [
  makeComponent('ex2-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex2-power-in', 0, 20, 'N'), cp('ex2-power-out', 60, 20, 'L')],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex2-breaker', 'circuit_breaker', '断路器', { x: 300, y: 300 },
    [cp('ex2-breaker-in', 0, 15, 'L'), cp('ex2-breaker-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex2-switch1', 'switch', '开关1', { x: 500, y: 200 },
    [cp('ex2-switch1-in', 0, 15, 'L'), cp('ex2-switch1-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.switch),
  makeComponent('ex2-switch2', 'switch', '开关2', { x: 500, y: 400 },
    [cp('ex2-switch2-in', 0, 15, 'L'), cp('ex2-switch2-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.switch),
  makeComponent('ex2-light', 'light', '灯具', { x: 700, y: 300 },
    [cp('ex2-light-in', 0, 20, 'L'), cp('ex2-light-out', 50, 20, 'N')],
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
// 示例 3: 插座回路含保护
// 电源 → 断路器 → 3 个插座并联
// ============================================================

const ex3Components: Component[] = [
  makeComponent('ex3-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex3-power-in', 0, 20, 'N'), cp('ex3-power-out', 60, 20, 'L')],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex3-breaker', 'circuit_breaker', '断路器', { x: 300, y: 300 },
    [cp('ex3-breaker-in', 0, 15, 'L'), cp('ex3-breaker-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex3-outlet1', 'outlet', '插座1', { x: 550, y: 150 },
    [cp('ex3-outlet1-in', 0, 20, 'L'), cp('ex3-outlet1-out', 50, 20, 'N')],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  makeComponent('ex3-outlet2', 'outlet', '插座2', { x: 550, y: 300 },
    [cp('ex3-outlet2-in', 0, 20, 'L'), cp('ex3-outlet2-out', 50, 20, 'N')],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  makeComponent('ex3-outlet3', 'outlet', '插座3', { x: 550, y: 450 },
    [cp('ex3-outlet3-in', 0, 20, 'L'), cp('ex3-outlet3-out', 50, 20, 'N')],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
]

const ex3Wires: Wire[] = [
  makeWire('ex3-w1', 'ex3-power', 'ex3-power-out', 'ex3-breaker', 'ex3-breaker-in'),
  makeWire('ex3-w2', 'ex3-breaker', 'ex3-breaker-out', 'ex3-outlet1', 'ex3-outlet1-in'),
  makeWire('ex3-w3', 'ex3-breaker', 'ex3-breaker-out', 'ex3-outlet2', 'ex3-outlet2-in'),
  makeWire('ex3-w4', 'ex3-breaker', 'ex3-breaker-out', 'ex3-outlet3', 'ex3-outlet3-in'),
]
// ============================================================
// 示例 4: 专线回路
// 电源 → 独立断路器 → 冰箱 + 热水器并联
// ============================================================
const ex4Components: Component[] = [
  makeComponent('ex4-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex4-power-in', 0, 20, 'N'), cp('ex4-power-out', 60, 20, 'L')],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex4-breaker', 'circuit_breaker', '厨房断路器', { x: 300, y: 300 },
    [cp('ex4-breaker-in', 0, 15, 'L'), cp('ex4-breaker-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex4-fridge', 'refrigerator', '冰箱', { x: 550, y: 200 },
    [cp('ex4-fridge-in', 0, 25, 'L'), cp('ex4-fridge-out', 60, 25, 'N')],
    APPLIANCE_PARAMS.refrigerator),
  makeComponent('ex4-heater', 'water_heater', '热水器', { x: 550, y: 420 },
    [cp('ex4-heater-in', 0, 25, 'L'), cp('ex4-heater-out', 60, 25, 'N')],
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
    [cp('ex5-power-in', 0, 20, 'N'), cp('ex5-power-out', 60, 20, 'L')],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex5-breaker', 'circuit_breaker', '空调断路器(25A)', { x: 350, y: 300 },
    [cp('ex5-breaker-in', 0, 15, 'L'), cp('ex5-breaker-out', 50, 15, 'L')],
    { ...BASIC_COMPONENT_PARAMS.circuit_breaker, maxCurrent: 25 }),
  makeComponent('ex5-ac', 'air_conditioner', '空调', { x: 600, y: 300 },
    [cp('ex5-ac-in', 0, 25, 'L'), cp('ex5-ac-out', 60, 25, 'N')],
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
    [cp('ex6-power-in', 0, 20, 'N'), cp('ex6-power-out', 60, 20, 'L')],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex6-main-breaker', 'circuit_breaker', '总断路器', { x: 200, y: 350 },
    [cp('ex6-mb-in', 0, 15, 'L'), cp('ex6-mb-out', 50, 15, 'L')],
    { ...BASIC_COMPONENT_PARAMS.circuit_breaker, maxCurrent: 63 }),
  // 照明分支
  makeComponent('ex6-light-switch', 'switch', '照明开关', { x: 450, y: 100 },
    [cp('ex6-ls-in', 0, 15, 'L'), cp('ex6-ls-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.switch),
  makeComponent('ex6-light', 'light', '客厅灯', { x: 650, y: 100 },
    [cp('ex6-light-in', 0, 20, 'L'), cp('ex6-light-out', 50, 20, 'N')],
    BASIC_COMPONENT_PARAMS.light),
  // 插座分支
  makeComponent('ex6-outlet1', 'outlet', '插座1', { x: 450, y: 250 },
    [cp('ex6-o1-in', 0, 20, 'L'), cp('ex6-o1-out', 50, 20, 'N')],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  makeComponent('ex6-outlet2', 'outlet', '插座2', { x: 650, y: 250 },
    [cp('ex6-o2-in', 0, 20, 'L'), cp('ex6-o2-out', 50, 20, 'N')],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  makeComponent('ex6-outlet3', 'outlet', '插座3', { x: 850, y: 250 },
    [cp('ex6-o3-in', 0, 20, 'L'), cp('ex6-o3-out', 50, 20, 'N')],
    { ...BASIC_COMPONENT_PARAMS.outlet, power: 200, resistance: 242 }),
  // 空调分支
  makeComponent('ex6-ac', 'air_conditioner', '空调', { x: 450, y: 420 },
    [cp('ex6-ac-in', 0, 25, 'L'), cp('ex6-ac-out', 60, 25, 'N')],
    APPLIANCE_PARAMS.air_conditioner),
  // 厨房分支
  makeComponent('ex6-fridge', 'refrigerator', '冰箱', { x: 450, y: 570 },
    [cp('ex6-fridge-in', 0, 25, 'L'), cp('ex6-fridge-out', 60, 25, 'N')],
    APPLIANCE_PARAMS.refrigerator),
  makeComponent('ex6-heater', 'water_heater', '热水器', { x: 700, y: 570 },
    [cp('ex6-heater-in', 0, 25, 'L'), cp('ex6-heater-out', 60, 25, 'N')],
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
// 示例 7: 五孔插座接线
// 电源 → 断路器 → 五孔插座（L/N/E 三端口）
// ============================================================

const ex7Components: Component[] = [
  makeComponent('ex7-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex7-power-in', 0, 20, 'N'), cp('ex7-power-out', 60, 20, 'L')],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex7-breaker', 'circuit_breaker', '断路器', { x: 300, y: 300 },
    [cp('ex7-breaker-in', 0, 15, 'L'), cp('ex7-breaker-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex7-outlet', 'outlet_5hole', '五孔插座', { x: 550, y: 300 },
    [cp('ex7-outlet-L', 0, 20, 'L'), cp('ex7-outlet-N', 50, 20, 'N'), cp('ex7-outlet-E', 25, 0, 'E')],
    { ...BASIC_COMPONENT_PARAMS.outlet_5hole, power: 200, resistance: 242 }),
]

const ex7Wires: Wire[] = [
  makeWire('ex7-w1', 'ex7-power', 'ex7-power-out', 'ex7-breaker', 'ex7-breaker-in'),
  makeWire('ex7-w2', 'ex7-breaker', 'ex7-breaker-out', 'ex7-outlet', 'ex7-outlet-L'),
]

// ============================================================
// 示例 8: 双联双控接线
// 电源 → 断路器 → 双联双控开关 → 灯1 + 灯2
// ============================================================

const ex8Components: Component[] = [
  makeComponent('ex8-power', 'power', '电源', { x: 100, y: 300 },
    [cp('ex8-power-in', 0, 20, 'N'), cp('ex8-power-out', 60, 20, 'L')],
    BASIC_COMPONENT_PARAMS.power),
  makeComponent('ex8-breaker', 'circuit_breaker', '断路器', { x: 300, y: 300 },
    [cp('ex8-breaker-in', 0, 15, 'L'), cp('ex8-breaker-out', 50, 15, 'L')],
    BASIC_COMPONENT_PARAMS.circuit_breaker),
  makeComponent('ex8-dual-sw', 'dual_switch', '双联双控开关', { x: 500, y: 280 },
    [cp('ex8-dsw-L1in', 0, 10, 'L1'), cp('ex8-dsw-L1out', 60, 10, 'L1'), cp('ex8-dsw-L2in', 0, 30, 'L2'), cp('ex8-dsw-L2out', 60, 30, 'L2')],
    BASIC_COMPONENT_PARAMS.dual_switch),
  makeComponent('ex8-light1', 'light', '灯1', { x: 700, y: 200 },
    [cp('ex8-light1-in', 0, 20, 'L'), cp('ex8-light1-out', 50, 20, 'N')],
    BASIC_COMPONENT_PARAMS.light),
  makeComponent('ex8-light2', 'light', '灯2', { x: 700, y: 400 },
    [cp('ex8-light2-in', 0, 20, 'L'), cp('ex8-light2-out', 50, 20, 'N')],
    BASIC_COMPONENT_PARAMS.light),
]

const ex8Wires: Wire[] = [
  makeWire('ex8-w1', 'ex8-power', 'ex8-power-out', 'ex8-breaker', 'ex8-breaker-in'),
  makeWire('ex8-w2', 'ex8-breaker', 'ex8-breaker-out', 'ex8-dual-sw', 'ex8-dsw-L1in'),
  makeWire('ex8-w3', 'ex8-breaker', 'ex8-breaker-out', 'ex8-dual-sw', 'ex8-dsw-L2in'),
  makeWire('ex8-w4', 'ex8-dual-sw', 'ex8-dsw-L1out', 'ex8-light1', 'ex8-light1-in'),
  makeWire('ex8-w5', 'ex8-dual-sw', 'ex8-dsw-L2out', 'ex8-light2', 'ex8-light2-in'),
]

// ============================================================
// 导出所有示例
// ============================================================

function makeDiagram(id: string, name: string, components: Component[], wires: Wire[]): CircuitDiagram {
  return { id, name, components, wires, createdAt: ts, updatedAt: ts }
}

export const singleLightSwitch = makeDiagram('ex1', '单灯单控', ex1Components, ex1Wires)
export const dualSwitchLight = makeDiagram('ex2', '双控照明', ex2Components, ex2Wires)
export const outletCircuit = makeDiagram('ex3', '插座回路含保护', ex3Components, ex3Wires)
export const kitchenCircuit = makeDiagram('ex4', '专线回路', ex4Components, ex4Wires)
export const acDedicatedLine = makeDiagram('ex5', '空调专线', ex5Components, ex5Wires)
export const wholeHouseDistribution = makeDiagram('ex6', '全屋配电', ex6Components, ex6Wires)
export const fiveHoleOutletWiring = makeDiagram('ex7', '五孔插座接线', ex7Components, ex7Wires)
export const dualSwitchWiring = makeDiagram('ex8', '双联双控接线', ex8Components, ex8Wires)

export const CIRCUIT_EXAMPLES: Array<CircuitExampleWithSteps> = [
  {
    name: '单灯单控',
    description: '最基本的家庭照明回路：电源 → 断路器 → 开关 → 灯',
    diagram: singleLightSwitch,
    teachingLabel: '基础照明回路',
    teachingTag: '入门',
    steps: [
      { step: 1, description: '连接火线主干：电源(L) → 断路器(L) → 开关(L)。' },
      { step: 2, description: '连接负载线：开关输出端(L) → 灯具输入端(L)。' },
      { step: 3, description: '连接零线回路：灯具零线端(N) → 电源零线端(N)。' },
    ],
  },
  {
    name: '双控照明',
    description: '双控照明教学场景：两个控制点协同控制同一照明负载（教育简化版）',
    diagram: dualSwitchLight,
    teachingLabel: '双点控制概念',
    teachingTag: '进阶',
    steps: [
      { step: 1, description: '先接火线主干：电源(L) → 断路器(L)。' },
      { step: 2, description: '将断路器输出并联分到两个开关输入端。' },
      { step: 3, description: '把两个开关输出分别并到同一灯具火线端(L)。' },
      { step: 4, description: '补齐零线：灯具零线端(N) → 电源零线端(N)。' },
    ],
  },
  {
    name: '插座回路含保护',
    description: '插座回路含保护教学场景：由断路器保护的3个并联插座支路',
    diagram: outletCircuit,
    teachingLabel: '并联负载分配',
    teachingTag: '入门',
    steps: [
      { step: 1, description: '连接电源到断路器：电源(L) → 断路器(L)。' },
      { step: 2, description: '从断路器输出并联分支到插座1火线端。' },
      { step: 3, description: '继续并联分支到插座2与插座3火线端。' },
      { step: 4, description: '检查各插座零线端已形成回路到电源零线端(N)。' },
    ],
  },
  {
    name: '专线回路',
    description: '专线回路教学场景：独立断路器下接入大功率负载支路（冰箱与热水器）',
    diagram: kitchenCircuit,
    teachingLabel: '大功率并联回路',
    teachingTag: '安全重点',
    steps: [
      { step: 1, description: '连接火线主干：电源(L) → 厨房断路器(L)。' },
      { step: 2, description: '断路器输出第一支路接到冰箱输入端(L)。' },
      { step: 3, description: '断路器输出第二支路接到热水器输入端(L)。' },
      { step: 4, description: '确认两台电器零线端(N)都回到电源零线侧。' },
    ],
  },
  {
    name: '空调专线',
    description: '空调独立回路：25A断路器保护的大功率专线',
    diagram: acDedicatedLine,
    teachingLabel: '专线保护',
    teachingTag: '安全重点',
    steps: [
      { step: 1, description: '连接电源火线到 25A 断路器输入端。' },
      { step: 2, description: '连接断路器输出到空调火线输入端(L)。' },
      { step: 3, description: '连接空调零线端(N)回到电源零线端。' },
    ],
  },
  {
    name: '全屋配电',
    description: '完整家庭配电系统：总断路器下分照明、插座、空调、厨房4个分支',
    diagram: wholeHouseDistribution,
    teachingLabel: '分级配电结构',
    teachingTag: '综合',
    steps: [
      { step: 1, description: '连接总主干：总电源(L) → 总断路器(L)。' },
      { step: 2, description: '从总断路器输出分出照明支路：开关 → 客厅灯。' },
      { step: 3, description: '从总断路器输出分出插座支路：插座1、2、3并联。' },
      { step: 4, description: '从总断路器输出分出空调与厨房支路：空调、冰箱、热水器。' },
      { step: 5, description: '统一核对各支路零线回路连续且无遗漏。' },
    ],
  },
  {
    name: '五孔插座接线',
    description: '五孔插座的标准接线：火线L、零线N、地线E的正确接法',
    diagram: fiveHoleOutletWiring,
    teachingLabel: '插座端子识别',
    teachingTag: '规范',
    steps: [
      { step: 1, description: '连接火线：电源(L) → 断路器(L) → 五孔插座 L 端。' },
      { step: 2, description: '连接零线：电源(N) 应接至五孔插座 N 端。' },
      { step: 3, description: '连接地线：五孔插座 E 端应接地线端子。' },
      { step: 4, description: '教学提示：本示例导线仅显式展示火线连接路径。' },
    ],
  },
  {
    name: '双联双控接线',
    description: '双联双控开关接线：一个开关面板控制两盏灯的独立开关',
    diagram: dualSwitchWiring,
    teachingLabel: '双回路独立控制',
    teachingTag: '进阶',
    steps: [
      { step: 1, description: '连接火线主干：电源(L) → 断路器(L)。' },
      { step: 2, description: '从断路器输出分别接到双联开关 L1/L2 输入端。' },
      { step: 3, description: '双联开关 L1 输出接灯1火线端，L2 输出接灯2火线端。' },
      { step: 4, description: '分别补齐灯1、灯2零线端(N)回到电源零线端。' },
    ],
  },
]
