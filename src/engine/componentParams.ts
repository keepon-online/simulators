import type { ComponentType, ComponentParams } from '../types'

// 中国家庭电路标准电压
export const HOUSEHOLD_VOLTAGE = 220

// 基础元件参数库
export const BASIC_COMPONENT_PARAMS: Record<string, ComponentParams> = {
  power: {
    voltage: HOUSEHOLD_VOLTAGE,
    resistance: 0, // 理想电源内阻
  },
  switch: {
    resistance: 0.01, // 导通时电阻
  },
  light: {
    voltage: HOUSEHOLD_VOLTAGE,
    power: 60, // 白炽灯
    resistance: 806.67, // R = V²/P = 220²/60
  },
  outlet: {
    voltage: HOUSEHOLD_VOLTAGE,
  },
  circuit_breaker: {
    voltage: HOUSEHOLD_VOLTAGE,
    maxCurrent: 20, // 20A 断路器
    resistance: 0.01,
  },
  fuse: {
    voltage: HOUSEHOLD_VOLTAGE,
    ratedCurrent: 10, // 10A 保险丝
    resistance: 0.05,
  },
  wire: {
    resistance: 0.1, // 每段导线电阻
  },
  resistor: {
    voltage: HOUSEHOLD_VOLTAGE,
    resistance: 100, // 默认电阻值
  },
}

// 电器负载参数库
export const APPLIANCE_PARAMS: Record<string, ComponentParams> = {
  refrigerator: {
    voltage: HOUSEHOLD_VOLTAGE,
    power: 1200, // 冰箱功率 1200W
    resistance: 40.27, // R = V²/P
  },
  air_conditioner: {
    voltage: HOUSEHOLD_VOLTAGE,
    power: 3000, // 空调功率 3000W (制冷)
    resistance: 16.13,
  },
  tv: {
    voltage: HOUSEHOLD_VOLTAGE,
    power: 600, // 电视功率 600W
    resistance: 80.67,
  },
  washer: {
    voltage: HOUSEHOLD_VOLTAGE,
    power: 1000, // 洗衣机功率 1000W
    resistance: 48.4,
  },
  water_heater: {
    voltage: HOUSEHOLD_VOLTAGE,
    power: 2000, // 热水器功率 2000W
    resistance: 24.2,
  },
}

// 所有元件参数合并
export const COMPONENT_PARAMS: Record<ComponentType, ComponentParams> = {
  ...BASIC_COMPONENT_PARAMS,
  ...APPLIANCE_PARAMS,
} as Record<ComponentType, ComponentParams>

// 获取元件参数
export function getComponentParams(type: ComponentType): ComponentParams {
  return COMPONENT_PARAMS[type] || {}
}

// 获取元件显示名称
export function getComponentDisplayName(type: ComponentType): string {
  const names: Record<ComponentType, string> = {
    power: '电源 (220V)',
    switch: '开关',
    light: '灯具 (60W)',
    outlet: '插座',
    circuit_breaker: '断路器 (20A)',
    fuse: '保险丝 (10A)',
    wire: '导线',
    resistor: '电阻',
    refrigerator: '冰箱 (1200W)',
    air_conditioner: '空调 (3000W)',
    tv: '电视 (600W)',
    washer: '洗衣机 (1000W)',
    water_heater: '热水器 (2000W)',
  }
  return names[type] || type
}

// 获取元件图标颜色
export function getComponentColor(type: ComponentType): string {
  const colors: Record<ComponentType, string> = {
    power: '#ef4444',    // 红色
    switch: '#3b82f6',   // 蓝色
    light: '#f59e0b',    // 黄色
    outlet: '#10b981',   // 绿色
    circuit_breaker: '#8b5cf6', // 紫色
    fuse: '#ec4899',     // 粉色
    wire: '#6b7280',     // 灰色
    resistor: '#6366f1',  // 靛蓝
    refrigerator: '#06b6d4', // 青色
    air_conditioner: '#14b8a6', // 青色
    tv: '#f97316',       // 橙色
    washer: '#84cc16',   // 柠檬绿
    water_heater: '#ef4444', // 红色
  }
  return colors[type] || '#6b7280'
}

// 计算元件的理论电流
export function getComponentCurrent(type: ComponentType): number {
  const params = getComponentParams(type)
  if (params.power && params.voltage) {
    return params.power / params.voltage
  }
  return 0
}

// 断路器额定电流选项
export const CIRCUIT_BREAKER_RATINGS = [10, 16, 20, 25, 32, 40, 63]

// 保险丝额定电流选项
export const FUSE_RATINGS = [1, 2, 5, 10, 15, 20, 30]

// 常见灯具功率选项
export const LIGHT_POWER_OPTIONS = [15, 25, 40, 60, 100, 200]
