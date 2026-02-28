// 基础元件类型
export type ComponentType = 
  | 'power'        // 电源
  | 'switch'       // 开关
  | 'light'        // 灯具
  | 'outlet'       // 插座
  | 'circuit_breaker' // 断路器
  | 'fuse'         // 保险丝
  | 'wire'         // 导线
  | 'refrigerator' // 冰箱
  | 'air_conditioner' // 空调
  | 'tv'           // 电视
  | 'washer'       // 洗衣机
  | 'water_heater' // 热水器
  | 'resistor'     // 电阻（通用负载）
  | 'outlet_5hole' // 五孔插座
  | 'dual_switch'   // 双联双控开关

// 电器负载类型
export type ApplianceType = 
  | 'refrigerator' 
  | 'air_conditioner' 
  | 'tv' 
  | 'washer' 
  | 'water_heater'

// 基础元件类型
export type BasicComponentType = 
  | 'power'
  | 'switch'
  | 'light'
  | 'outlet'
  | 'circuit_breaker'
  | 'fuse'
  | 'wire'
  | 'resistor'
  | 'outlet_5hole'
  | 'dual_switch'

// 元件状态
export type ComponentStatus = 'on' | 'off' | 'tripped' | 'blown' | 'normal'

// 电气参数
export interface ElectricalValues {
  voltage: number      // 电压 (V)
  current: number      // 电流 (A)
  power: number        // 功率 (W)
  resistance: number  // 电阻 (Ω)
}

// 连接点
export interface ConnectionPoint {
  id: string
  x: number
  y: number
  label?: string
}

// 电路元件
export interface Component {
  id: string
  type: ComponentType
  name: string
  position: { x: number; y: number }
  rotation: number // 0, 90, 180, 270
  connections: ConnectionPoint[]
  params: ComponentParams
  status: ComponentStatus
  state: ComponentState
}

// 元件参数
export interface ComponentParams {
  voltage?: number        // 额定电压 (V)
  power?: number         // 额定功率 (W)
  resistance?: number    // 电阻 (Ω)
  maxCurrent?: number    // 最大电流 (A) - 断路器/保险丝用
  ratedCurrent?: number  // 额定电流 (A)
}

// 元件状态（开关状态等）
export interface ComponentState {
  isOn: boolean
  // 断路器状态
  tripped?: boolean
  // 保险丝状态
  blown?: boolean
  // 双联开关第二路状态
  isOn2?: boolean
}

// 导线连接
export interface Wire {
  id: string
  from: {
    componentId: string
    pointId: string
  }
  to: {
    componentId: string
    pointId: string
  }
  points?: { x: number; y: number }[] // 拐点
}

// 电路图
export interface CircuitDiagram {
  id: string
  name: string
  components: Component[]
  wires: Wire[]
  createdAt: string
  updatedAt: string
}

// 故障类型
export type FaultType = 
  | 'short_circuit'   // 短路
  | 'overload'        // 过载
  | 'open_circuit'    // 开路/断路
  | 'ground_fault'    // 接地故障

// 故障检测结果
export interface FaultDetection {
  type: FaultType
  componentId?: string
  message: string
  severity: 'warning' | 'error' | 'critical'
}

// 电路状态
export interface CircuitState {
  diagram: CircuitDiagram
  electricalValues: Map<string, ElectricalValues> // componentId -> values
  faults: FaultDetection[]
  totalPower: number
  totalCurrent: number
  isValid: boolean
}

// 计算结果
export interface CalculationResult {
  componentId: string
  values: ElectricalValues
  path: string[] // 从电源到该元件的路径
}

// 支路信息
export interface BranchInfo {
  id: string
  components: string[]
  totalResistance: number
  current: number
  power: number
}

// 负载分析结果
export interface LoadAnalysis {
  totalPower: number           // 总功率 (W)
  totalCurrent: number         // 总电流 (A)
  branches: BranchInfo[]        // 各支路信息
  overloadedBranches: string[] // 过载的支路
  capacity: number            // 额定容量 (通常是断路器最大电流)
  usage: number                // 使用率 (%)
}
