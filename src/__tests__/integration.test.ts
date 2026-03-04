import { describe, it, expect } from 'vitest'
import {
  createCircuitDiagram,
  createComponent,
  createWire,
  addComponent,
  addWire,
} from '../engine/models'
import { calculateCircuitState, calculateOhmLaw } from '../engine/calculator'
import { detectFaults } from '../engine/faultDetector'

describe('集成测试: 完整电路场景', () => {
  describe('场景1: 简单串联电路', () => {
    it('应该正确计算电路参数', () => {
      let diagram = createCircuitDiagram('简单串联电路')
      
      const power = createComponent('power', '电源', { x: 0, y: 100 })
      const light = createComponent('light', '灯具1', { x: 200, y: 100 }, { power: 60 })
      
      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, light)
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, light.id, light.connections[0].id))
      
      const circuitState = calculateCircuitState(diagram)
      const lightValues = circuitState.electricalValues.get(light.id)
      
      expect(lightValues).toBeDefined()
      expect(lightValues?.current).toBeCloseTo(0.273, 2)
      expect(lightValues?.voltage).toBeCloseTo(220, 6)
      expect(lightValues?.power).toBeCloseTo(60, 0)
      expect(circuitState.isValid).toBe(true)
    })
  })
  
  describe('场景2: 过载保护', () => {
    it('应该检测到过载故障', () => {
      let diagram = createCircuitDiagram('过载测试')
      
      const breaker = createComponent('circuit_breaker', '总开关', { x: 50, y: 50 }, { maxCurrent: 20 })
      const ac1 = createComponent('air_conditioner', '空调1', { x: 100, y: 100 }, { power: 3000 })
      const ac2 = createComponent('air_conditioner', '空调2', { x: 200, y: 100 }, { power: 3000 })
      const heater = createComponent('water_heater', '热水器', { x: 300, y: 100 }, { power: 2000 })
      const power = createComponent('power', '电源', { x: 0, y: 100 })
      
      diagram = addComponent(diagram, breaker)
      diagram = addComponent(diagram, ac1)
      diagram = addComponent(diagram, ac2)
      diagram = addComponent(diagram, heater)
      diagram = addComponent(diagram, power)
      
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, breaker.id, breaker.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, ac1.id, ac1.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, ac2.id, ac2.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, heater.id, heater.connections[0].id))
      
      const faults = detectFaults(diagram)
      const overloadFaults = faults.filter(f => f.type === 'overload')
      expect(overloadFaults.length).toBeGreaterThan(0)
    })
  })
  
  describe('场景3: 短路检测', () => {
    it('应该检测到短路故障', () => {
      let diagram = createCircuitDiagram('短路测试')
      
      const power = createComponent('power', '电源', { x: 0, y: 100 })
      const short = createComponent('resistor', '短路', { x: 100, y: 100 }, { resistance: 0.01 })
      
      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, short)
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, short.id, short.connections[0].id))
      
      const circuitState = calculateCircuitState(diagram)
      const shortValues = circuitState.electricalValues.get(short.id)
      
      expect(shortValues?.current).toBeGreaterThan(100)
      
      const faults = detectFaults(diagram)
      const shortFaults = faults.filter(f => f.type === 'short_circuit')
      expect(shortFaults.length).toBeGreaterThan(0)
    })
  })
  
  describe('场景4: 开路检测', () => {
    it('应该检测到未连接的元件', () => {
      let diagram = createCircuitDiagram('开路测试')
      
      const power = createComponent('power', '电源', { x: 0, y: 100 })
      const light = createComponent('light', '灯具', { x: 200, y: 100 })
      
      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, light)
      
      const faults = detectFaults(diagram)
      const openFaults = faults.filter(f => f.type === 'open_circuit')
      expect(openFaults.length).toBeGreaterThan(0)
    })
    
    it('无电源时应该报错', () => {
      const diagram = createCircuitDiagram('无电源测试')
      const light = createComponent('light', '灯具', { x: 100, y: 100 })
      const diagramWithLight = addComponent(diagram, light)
      
      const circuitState = calculateCircuitState(diagramWithLight)
      expect(circuitState.isValid).toBe(false)
      expect(circuitState.faults.length).toBeGreaterThan(0)
    })
  })
  
  describe('场景5: 欧姆定律计算', () => {
    it('应该正确计算 V=IR', () => {
      const result = calculateOhmLaw(220, 100)
      
      expect(result.voltage).toBe(220)
      expect(result.resistance).toBe(100)
      expect(result.current).toBeCloseTo(2.2, 1)
      expect(result.power).toBeCloseTo(484, 0)
    })
    
    it('应该处理零电阻', () => {
      const result = calculateOhmLaw(220, 0)
      expect(result.current).toBe(0)
    })
    
    it('应该处理无穷电阻', () => {
      const result = calculateOhmLaw(220, Infinity)
      expect(result.current).toBe(0)
      expect(result.power).toBe(0)
    })
  })
  
  describe('场景6: 完整家庭电路', () => {
    it('完整家庭电路应该正常工作', () => {
      let diagram = createCircuitDiagram('完整家庭电路')
      
      const power = createComponent('power', '总电源', { x: 0, y: 50 })
      diagram = addComponent(diagram, power)
      
      const livingLight = createComponent('light', '客厅灯', { x: 160, y: 120 }, { power: 60 })
      diagram = addComponent(diagram, livingLight)
      
      const tv = createComponent('tv', '电视', { x: 160, y: 270 }, { power: 600 })
      diagram = addComponent(diagram, tv)
      
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, livingLight.id, livingLight.connections[0].id))
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, tv.id, tv.connections[0].id))
      
      const circuitState = calculateCircuitState(diagram)
      
      expect(circuitState.isValid).toBe(true)
      expect(circuitState.totalPower).toBeCloseTo(660, 0)
      expect(circuitState.totalCurrent).toBeCloseTo(3, 1)
    })
  })

  describe('场景7: 拓扑驱动最小能力', () => {
    it('串联电阻应按总电阻计算且电流一致', () => {
      let diagram = createCircuitDiagram('串联电阻')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const r1 = createComponent('resistor', 'R1', { x: 120, y: 0 }, { resistance: 100 })
      const r2 = createComponent('resistor', 'R2', { x: 240, y: 0 }, { resistance: 100 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, r1)
      diagram = addComponent(diagram, r2)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, r1.id, r1.connections[0].id))
      diagram = addWire(diagram, createWire(r1.id, r1.connections[1].id, r2.id, r2.connections[0].id))

      const state = calculateCircuitState(diagram)
      const r1Values = state.electricalValues.get(r1.id)
      const r2Values = state.electricalValues.get(r2.id)

      expect(r1Values?.current).toBeCloseTo(1.1, 2)
      expect(r2Values?.current).toBeCloseTo(1.1, 2)
      expect(state.totalCurrent).toBeCloseTo(1.1, 2)
      expect(r1Values?.voltage).toBeCloseTo(110, 0)
      expect(r2Values?.voltage).toBeCloseTo(110, 0)
    })

    it('并联电阻应分流且总电流为支路之和', () => {
      let diagram = createCircuitDiagram('并联电阻')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const r1 = createComponent('resistor', 'R1', { x: 120, y: -60 }, { resistance: 100 })
      const r2 = createComponent('resistor', 'R2', { x: 120, y: 60 }, { resistance: 100 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, r1)
      diagram = addComponent(diagram, r2)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, r1.id, r1.connections[0].id))
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, r2.id, r2.connections[0].id))

      const state = calculateCircuitState(diagram)
      const r1Values = state.electricalValues.get(r1.id)
      const r2Values = state.electricalValues.get(r2.id)

      expect(r1Values?.current).toBeCloseTo(2.2, 1)
      expect(r2Values?.current).toBeCloseTo(2.2, 1)
      expect(state.totalCurrent).toBeCloseTo(4.4, 1)
    })

    it('开关断开时应切断下游负载电流', () => {
      let diagram = createCircuitDiagram('开关断开')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const sw = createComponent('switch', 'S1', { x: 120, y: 0 })
      sw.state.isOn = false
      const light = createComponent('light', '灯具', { x: 240, y: 0 }, { power: 60 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, sw)
      diagram = addComponent(diagram, light)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, sw.id, sw.connections[0].id))
      diagram = addWire(diagram, createWire(sw.id, sw.connections[1].id, light.id, light.connections[0].id))

      const state = calculateCircuitState(diagram)
      const lightValues = state.electricalValues.get(light.id)

      expect(lightValues?.current).toBe(0)
      expect(state.totalCurrent).toBe(0)
      expect(state.totalPower).toBe(0)
    })

    it('断路器跳闸时应切断下游支路电流', () => {
      let diagram = createCircuitDiagram('断路器跳闸')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '总断路器', { x: 120, y: 0 }, { maxCurrent: 20 })
      breaker.state.tripped = true
      const heater = createComponent('water_heater', '热水器', { x: 240, y: 0 }, { power: 2000 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, breaker)
      diagram = addComponent(diagram, heater)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, breaker.id, breaker.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, heater.id, heater.connections[0].id))

      const state = calculateCircuitState(diagram)
      const heaterValues = state.electricalValues.get(heater.id)

      expect(heaterValues?.current).toBe(0)
      expect(state.totalCurrent).toBe(0)
      expect(state.totalPower).toBe(0)
    })
  })
})
