import type { 
  Component, 
  CircuitDiagram, 
  FaultDetection, 
  ElectricalValues,
  CircuitState 
} from '../types'
import { 
  calculateCircuitState, 
  SHORT_CIRCUIT_THRESHOLD,
  getComponentResistance
} from './calculator'

// 断路器默认额定电流 (A)
export const DEFAULT_CIRCUIT_BREAKER_RATING = 20

// 保险丝默认额定电流 (A)
export const DEFAULT_FUSE_RATING = 10

// 过载阈值 (超过额定电流的百分比)
export const OVERLOAD_THRESHOLD = 1.2

// 检测短路故障
export function detectShortCircuit(
  component: Component,
  values: ElectricalValues
): FaultDetection | null {
  const resistance = getComponentResistance(component)
  
  if (
    resistance > 0
    && resistance < SHORT_CIRCUIT_THRESHOLD
    && component.type !== 'power'
    && component.type !== 'circuit_breaker'
    && component.type !== 'fuse'
  ) {
    return {
      type: 'short_circuit',
      componentId: component.id,
      message: `元件 ${component.name} 检测到短路 (R=${resistance.toFixed(3)}Ω)`,
      severity: 'critical',
    }
  }
  
  if (values.current > 100) {
    return {
      type: 'short_circuit',
      componentId: component.id,
      message: `元件 ${component.name} 检测到异常高电流 (I=${values.current.toFixed(2)}A)`,
      severity: 'critical',
    }
  }
  
  return null
}

// 检测过载故障
export function detectOverload(
  component: Component,
  values: ElectricalValues,
  circuitState: CircuitState
): FaultDetection | null {
  const { type, params, name } = component
  
  if (type === 'circuit_breaker') {
    const ratedCurrent = params.maxCurrent || DEFAULT_CIRCUIT_BREAKER_RATING
    const maxAllowedCurrent = ratedCurrent * OVERLOAD_THRESHOLD
    
    if (values.current > maxAllowedCurrent) {
      return {
        type: 'overload',
        componentId: component.id,
        message: `断路器 ${name} 过载 (I=${values.current.toFixed(2)}A > ${maxAllowedCurrent.toFixed(2)}A)`,
        severity: 'error',
      }
    }
  }
  
  if (type === 'fuse') {
    const ratedCurrent = params.ratedCurrent || DEFAULT_FUSE_RATING
    const maxAllowedCurrent = ratedCurrent * OVERLOAD_THRESHOLD
    
    if (values.current > maxAllowedCurrent) {
      return {
        type: 'overload',
        componentId: component.id,
        message: `保险丝 ${name} 过载 (I=${values.current.toFixed(2)}A > ${maxAllowedCurrent.toFixed(2)}A)`,
        severity: 'error',
      }
    }
  }
  
  const mainBreaker = circuitState.diagram.components.find(
    c => c.type === 'circuit_breaker' && c.params.maxCurrent
  )
  
  if (mainBreaker && mainBreaker.params.maxCurrent) {
    const ratedCurrent = mainBreaker.params.maxCurrent
    const maxAllowedCurrent = ratedCurrent * OVERLOAD_THRESHOLD
    
    if (circuitState.totalCurrent > maxAllowedCurrent) {
      return {
        type: 'overload',
        componentId: mainBreaker.id,
        message: `总电路过载 (I=${circuitState.totalCurrent.toFixed(2)}A > ${maxAllowedCurrent.toFixed(2)}A)`,
        severity: 'critical',
      }
    }
  }
  
  return null
}

// 检测开路故障
export function detectOpenCircuit(
  diagram: CircuitDiagram,
  component: Component
): FaultDetection | null {
  if (component.type === 'switch' && !component.state.isOn) {
    return {
      type: 'open_circuit',
      componentId: component.id,
      message: `开关 ${component.name} 已断开`,
      severity: 'warning',
    }
  }
  
  if (component.type === 'circuit_breaker' && component.state.tripped) {
    return {
      type: 'open_circuit',
      componentId: component.id,
      message: `保护器件 断路器 ${component.name} 处于跳闸断开状态，请检查负载后复位再送电`,
      severity: 'error',
    }
  }
  
  if (component.type === 'fuse' && component.state.blown) {
    return {
      type: 'open_circuit',
      componentId: component.id,
      message: `保护器件 保险丝 ${component.name} 已熔断并断开，请先排查故障后再更换`,
      severity: 'error',
    }
  }
  
  const loadTypes = ['light', 'outlet', 'resistor', 'refrigerator', 'air_conditioner', 'tv', 'washer', 'water_heater']
  if (loadTypes.includes(component.type)) {
    const hasConnection = diagram.wires.some(
      w => w.from.componentId === component.id || w.to.componentId === component.id
    )
    
    if (!hasConnection) {
      return {
        type: 'open_circuit',
        componentId: component.id,
        message: `元件 ${component.name} 未连接`,
        severity: 'warning',
      }
    }
  }
  
  return null
}

// 主故障检测函数
export function detectFaults(diagram: CircuitDiagram): FaultDetection[] {
  const faults: FaultDetection[] = []
  
  const circuitState = calculateCircuitState(diagram)
  
  diagram.components.forEach(component => {
    const values = circuitState.electricalValues.get(component.id)
    
    if (!values) return
    
    const shortCircuit = detectShortCircuit(component, values)
    if (shortCircuit) {
      faults.push(shortCircuit)
      return
    }
    
    const overload = detectOverload(component, values, circuitState)
    if (overload) {
      faults.push(overload)
      return
    }
    
    const openCircuit = detectOpenCircuit(diagram, component)
    if (openCircuit) {
      faults.push(openCircuit)
    }
  })
  
  const severityOrder: Record<string, number> = { critical: 0, error: 1, warning: 2 }
  faults.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  
  return faults
}

// 检查电路是否有严重故障
export function hasCriticalFault(faults: FaultDetection[]): boolean {
  return faults.some(f => f.severity === 'critical' && f.type === 'short_circuit')
}

// 检查电路是否有过载
export function hasOverloadFault(faults: FaultDetection[]): boolean {
  return faults.some(f => f.type === 'overload')
}
