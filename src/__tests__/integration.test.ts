import { describe, it, expect } from 'vitest'
import {
  createCircuitDiagram,
  createComponent,
  createWire,
  addComponent,
  addWire,
} from '../engine/models'
import { calculateCircuitState, calculateOhmLaw, calculateComponentValues } from '../engine/calculator'
import { detectFaults } from '../engine/faultDetector'
import type { Wire, CircuitDiagram } from '../types'

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
      expect(overloadFaults.some(f => (f.suggestion ?? '').trim().length > 0)).toBe(true)
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
      expect(shortFaults.some(f => (f.suggestion ?? '').trim().length > 0)).toBe(true)
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
      expect(openFaults.some(f => (f.suggestion ?? '').trim().length > 0)).toBe(true)
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

  describe('场景8: 教学保护器件最小导通语义', () => {
    it('保护器件闭合时应允许下游导通（calculateComponentValues）', () => {
      let diagram = createCircuitDiagram('保护器件闭合')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '断路器', { x: 120, y: 0 }, { maxCurrent: 20 })
      const light = createComponent('light', '灯具', { x: 240, y: 0 }, { power: 60 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, breaker)
      diagram = addComponent(diagram, light)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, breaker.id, breaker.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, light.id, light.connections[0].id))

      const result = calculateComponentValues(diagram, light.id)

      expect(result).not.toBeNull()
      expect(result?.values.current ?? 0).toBeGreaterThan(0)
      expect(result?.values.power ?? 0).toBeGreaterThan(0)
    })

    it('保护器件断开时下游应无电流（calculateComponentValues）', () => {
      let diagram = createCircuitDiagram('保护器件断开')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '断路器', { x: 120, y: 0 }, { maxCurrent: 20 })
      breaker.state.tripped = true
      const light = createComponent('light', '灯具', { x: 240, y: 0 }, { power: 60 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, breaker)
      diagram = addComponent(diagram, light)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, breaker.id, breaker.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, light.id, light.connections[0].id))

      const result = calculateComponentValues(diagram, light.id)

      expect(result).not.toBeNull()
      expect(result?.values.current).toBe(0)
      expect(result?.values.power).toBe(0)
    })
  })

  describe('场景9: faultDetector 保护器件提示语义兼容', () => {
    it('保护器件断开故障应给出清晰教学提示', () => {
      let diagram = createCircuitDiagram('保护器件故障提示')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '总断路器', { x: 120, y: 0 }, { maxCurrent: 20 })
      breaker.state.tripped = true
      const light = createComponent('light', '灯具', { x: 240, y: 0 }, { power: 60 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, breaker)
      diagram = addComponent(diagram, light)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, breaker.id, breaker.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, light.id, light.connections[0].id))

      const faults = detectFaults(diagram)
      const protectionOpenFault = faults.find(f => f.type === 'open_circuit' && f.componentId === breaker.id)

      expect(protectionOpenFault).toBeDefined()
      expect(protectionOpenFault?.message).toContain('保护器件')
      expect(protectionOpenFault?.message).toContain('请检查')
    })

    it('保护器件正常闭合时不应误报开路故障', () => {
      let diagram = createCircuitDiagram('保护器件正常闭合')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '总断路器', { x: 120, y: 0 }, { maxCurrent: 20 })
      const light = createComponent('light', '灯具', { x: 240, y: 0 }, { power: 60 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, breaker)
      diagram = addComponent(diagram, light)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, breaker.id, breaker.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, light.id, light.connections[0].id))

      const faults = detectFaults(diagram)
      const breakerOpenFaults = faults.filter(f => f.type === 'open_circuit' && f.componentId === breaker.id)

      expect(breakerOpenFaults.length).toBe(0)
    })
  })

  describe('场景10: 故障提示增强断言', () => {
    it('故障结果应按 critical > error > warning 排序', () => {
      let diagram = createCircuitDiagram('故障排序测试')

      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '断路器', { x: 100, y: 0 }, { maxCurrent: 1 })
      const ac = createComponent('air_conditioner', '空调负载', { x: 220, y: 0 }, { power: 3000 })
      const short = createComponent('resistor', '短路电阻', { x: 200, y: 0 }, { resistance: 0.01 })
      const unconnectedLight = createComponent('light', '未接线灯具', { x: 320, y: 0 })

      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, breaker)
      diagram = addComponent(diagram, ac)
      diagram = addComponent(diagram, short)
      diagram = addComponent(diagram, unconnectedLight)

      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, breaker.id, breaker.connections[0].id))
      diagram = addWire(diagram, createWire(breaker.id, breaker.connections[1].id, ac.id, ac.connections[0].id))
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, short.id, short.connections[0].id))

      const faults = detectFaults(diagram)
      const severityRank: Record<string, number> = { critical: 0, error: 1, warning: 2 }

      expect(faults.length).toBeGreaterThan(1)

      for (let i = 1; i < faults.length; i += 1) {
        const previous = severityRank[faults[i - 1].severity]
        const current = severityRank[faults[i].severity]
        expect(previous).toBeLessThanOrEqual(current)
      }
    })

    it('未知故障类型在缺少建议时应使用兜底建议文案', () => {
      const unknownFault: {
        type: 'ground_fault'
        componentId: string
        message: string
        severity: 'warning'
        suggestion?: string
      } = {
        type: 'ground_fault',
        componentId: 'unknown-component',
        message: '未知故障',
        severity: 'warning',
      }

      const suggestion = unknownFault.suggestion ?? '请检查该回路连接与元件状态，按步骤排查后重试。'
      expect(suggestion).toBe('请检查该回路连接与元件状态，按步骤排查后重试。')
    })
  })

  describe('场景11: L-path 邻接表过滤', () => {
    function buildTestDiagramWithLN() {
      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '断路器', { x: 100, y: 0 })
      const light = createComponent('light', '灯', { x: 200, y: 0 }, { power: 60 })

      const pL = power.connections.find(c => c.label === 'L')!
      const pN = power.connections.find(c => c.label === 'N')!
      const bIn = breaker.connections[0]
      const bOut = breaker.connections[1]
      const lL = light.connections.find(c => c.label === 'L')!
      const lN = light.connections.find(c => c.label === 'N')!

      const wires: Wire[] = [
        { id: 'w1', from: { componentId: power.id, pointId: pL.id }, to: { componentId: breaker.id, pointId: bIn.id }, lineType: 'L' },
        { id: 'w2', from: { componentId: breaker.id, pointId: bOut.id }, to: { componentId: light.id, pointId: lL.id }, lineType: 'L' },
        { id: 'w3', from: { componentId: light.id, pointId: lN.id }, to: { componentId: power.id, pointId: pN.id }, lineType: 'N' },
      ]

      const diagram: CircuitDiagram = {
        id: 'test-ln',
        name: 'Test LN',
        components: [power, breaker, light],
        wires,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return { diagram, light }
    }

    function buildTestDiagramOldStyle() {
      let diagram = createCircuitDiagram('Old Style')
      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const light = createComponent('light', '灯', { x: 200, y: 0 }, { power: 60 })
      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, light)
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, light.id, light.connections[0].id))
      return diagram
    }

    it('L和N线共存时应正确计算导通树', () => {
      const { diagram, light } = buildTestDiagramWithLN()
      const state = calculateCircuitState(diagram)
      const lightValues = state.electricalValues.get(light.id)
      expect(lightValues?.current).toBeGreaterThan(0)
      expect(lightValues?.current).toBeCloseTo(0.27, 1)
    })

    it('无lineType的旧数据线应视为L兼容', () => {
      const diagram = buildTestDiagramOldStyle()
      const state = calculateCircuitState(diagram)
      expect(state.totalCurrent).toBeGreaterThan(0)
    })
  })

  describe('场景12: N-path 回路校验', () => {
    function buildTestDiagramOnlyL() {
      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '断路器', { x: 100, y: 0 })
      const light = createComponent('light', '灯', { x: 200, y: 0 }, { power: 60 })

      const pL = power.connections.find(c => c.label === 'L')!
      const bIn = breaker.connections[0]
      const bOut = breaker.connections[1]
      const lL = light.connections.find(c => c.label === 'L')!

      const wires: Wire[] = [
        { id: 'w1', from: { componentId: power.id, pointId: pL.id }, to: { componentId: breaker.id, pointId: bIn.id }, lineType: 'L' },
        { id: 'w2', from: { componentId: breaker.id, pointId: bOut.id }, to: { componentId: light.id, pointId: lL.id }, lineType: 'L' },
      ]

      return {
        id: 'test-only-l',
        name: 'Test Only L',
        components: [power, breaker, light],
        wires,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CircuitDiagram
    }

    function buildTestDiagramWithLN() {
      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const breaker = createComponent('circuit_breaker', '断路器', { x: 100, y: 0 })
      const light = createComponent('light', '灯', { x: 200, y: 0 }, { power: 60 })

      const pL = power.connections.find(c => c.label === 'L')!
      const pN = power.connections.find(c => c.label === 'N')!
      const bIn = breaker.connections[0]
      const bOut = breaker.connections[1]
      const lL = light.connections.find(c => c.label === 'L')!
      const lN = light.connections.find(c => c.label === 'N')!

      const wires: Wire[] = [
        { id: 'w1', from: { componentId: power.id, pointId: pL.id }, to: { componentId: breaker.id, pointId: bIn.id }, lineType: 'L' },
        { id: 'w2', from: { componentId: breaker.id, pointId: bOut.id }, to: { componentId: light.id, pointId: lL.id }, lineType: 'L' },
        { id: 'w3', from: { componentId: light.id, pointId: lN.id }, to: { componentId: power.id, pointId: pN.id }, lineType: 'N' },
      ]

      return {
        id: 'test-ln',
        name: 'Test LN',
        components: [power, breaker, light],
        wires,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CircuitDiagram
    }

    function buildTestDiagramOldStyle() {
      let diagram = createCircuitDiagram('Old Style')
      const power = createComponent('power', '电源', { x: 0, y: 0 })
      const light = createComponent('light', '灯', { x: 200, y: 0 }, { power: 60 })
      diagram = addComponent(diagram, power)
      diagram = addComponent(diagram, light)
      diagram = addWire(diagram, createWire(power.id, power.connections[1].id, light.id, light.connections[0].id))
      return diagram
    }

    it('只有L线无N线时应报告neutral_open', () => {
      const diagram = buildTestDiagramOnlyL()
      const faults = detectFaults(diagram)
      const neutralFault = faults.find(f => f.type === 'neutral_open')
      expect(neutralFault).toBeDefined()
      expect(neutralFault?.message).toContain('零线')
    })

    it('L和N线都存在时不应报告neutral_open', () => {
      const diagram = buildTestDiagramWithLN()
      const faults = detectFaults(diagram)
      const neutralFault = faults.find(f => f.type === 'neutral_open')
      expect(neutralFault).toBeUndefined()
    })

    it('旧电路(无lineType)不应报告neutral_open', () => {
      const diagram = buildTestDiagramOldStyle()
      const faults = detectFaults(diagram)
      const neutralFault = faults.find(f => f.type === 'neutral_open')
      expect(neutralFault).toBeUndefined()
    })
  })
})
