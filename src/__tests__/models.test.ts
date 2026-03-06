import { describe, it, expect } from 'vitest'
import type { Wire } from '../types'
import {
  createComponent,
  createCircuitDiagram,
  createDefaultConnections,
  createWire,
  inferLineType,
  addComponent,
  removeComponent,
  toggleSwitch,
  getComponent,
} from '../engine/models'

describe('Circuit Models', () => {
  describe('createComponent', () => {
    it('should create a component with generated id', () => {
      const component = createComponent('power', 'Main Power', { x: 100, y: 100 })
      
      expect(component.id).toBeDefined()
      expect(component.type).toBe('power')
      expect(component.name).toBe('Main Power')
      expect(component.position).toEqual({ x: 100, y: 100 })
      expect(component.status).toBe('normal')
    })
    
    it('should create component with default connections', () => {
      const component = createComponent('switch', 'Switch 1', { x: 0, y: 0 })
      
      expect(component.connections).toHaveLength(2)
      expect(component.connections[0].id).toBeDefined()
    })
    
    it('should create component with custom params', () => {
      const component = createComponent('light', 'Light 1', { x: 0, y: 0 }, {
        voltage: 220,
        power: 60,
      })
      
      expect(component.params.voltage).toBe(220)
      expect(component.params.power).toBe(60)
    })
  })
  
  describe('createCircuitDiagram', () => {
    it('should create a new circuit diagram', () => {
      const diagram = createCircuitDiagram('My Circuit')
      
      expect(diagram.id).toBeDefined()
      expect(diagram.name).toBe('My Circuit')
      expect(diagram.components).toHaveLength(0)
      expect(diagram.wires).toHaveLength(0)
      expect(diagram.createdAt).toBeDefined()
    })
    
    it('should use default name when not provided', () => {
      const diagram = createCircuitDiagram()
      
      expect(diagram.name).toBe('New Circuit')
    })
  })
  
  describe('addComponent', () => {
    it('should add component to diagram', () => {
      const diagram = createCircuitDiagram()
      const component = createComponent('power', 'Power', { x: 0, y: 0 })
      
      const updated = addComponent(diagram, component)
      
      expect(updated.components).toHaveLength(1)
      expect(updated.components[0].id).toBe(component.id)
    })
    
    it('should preserve existing components', () => {
      const component1 = createComponent('power', 'Power', { x: 0, y: 0 })
      const component2 = createComponent('switch', 'Switch', { x: 50, y: 0 })
      
      let diagram = createCircuitDiagram()
      diagram = addComponent(diagram, component1)
      diagram = addComponent(diagram, component2)
      
      expect(diagram.components).toHaveLength(2)
    })
  })
  
  describe('removeComponent', () => {
    it('should remove component from diagram', () => {
      const component = createComponent('power', 'Power', { x: 0, y: 0 })
      let diagram = createCircuitDiagram()
      diagram = addComponent(diagram, component)
      
      const updated = removeComponent(diagram, component.id)
      
      expect(updated.components).toHaveLength(0)
    })
  })
  
  describe('toggleSwitch', () => {
    it('should toggle switch state', () => {
      const component = createComponent('switch', 'Switch', { x: 0, y: 0 })
      let diagram = createCircuitDiagram()
      diagram = addComponent(diagram, component)
      
      expect(diagram.components[0].state.isOn).toBe(true)
      
      diagram = toggleSwitch(diagram, component.id)
      expect(diagram.components[0].state.isOn).toBe(false)
      
      diagram = toggleSwitch(diagram, component.id)
      expect(diagram.components[0].state.isOn).toBe(true)
    })
    
    it('should not toggle non-switch components', () => {
      const component = createComponent('power', 'Power', { x: 0, y: 0 })
      let diagram = createCircuitDiagram()
      diagram = addComponent(diagram, component)
      
      const updated = toggleSwitch(diagram, component.id)
      
      expect(updated.components[0].state.isOn).toBe(true)
    })
  })
  
  describe('getComponent', () => {
    it('should find component by id', () => {
      const component = createComponent('power', 'Power', { x: 0, y: 0 })
      let diagram = createCircuitDiagram()
      diagram = addComponent(diagram, component)
      
      const found = getComponent(diagram, component.id)
      
      expect(found).toBeDefined()
      expect(found?.id).toBe(component.id)
    })
    
    it('should return undefined for non-existent id', () => {
      const diagram = createCircuitDiagram()
      
      const found = getComponent(diagram, 'non-existent')
      
      expect(found).toBeUndefined()
    })
  })
})

describe('家电双连接点', () => {
  const applianceTypes = ['refrigerator', 'air_conditioner', 'tv', 'washer', 'water_heater'] as const
  applianceTypes.forEach(type => {
    it(`${type} 应有 2 个不同坐标的连接点`, () => {
      const connections = createDefaultConnections(type)
      expect(connections).toHaveLength(2)
      expect(connections[0].x !== connections[1].x || connections[0].y !== connections[1].y).toBe(true)
    })
  })
})

describe('outlet_5hole connections', () => {
  it('should have 3 connection points with correct labels', () => {
    const connections = createDefaultConnections('outlet_5hole')
    expect(connections).toHaveLength(3)
    expect(connections[0].label).toBe('L')
    expect(connections[1].label).toBe('N')
    expect(connections[2].label).toBe('E')
  })
})

describe('dual_switch connections', () => {
  it('should have 4 connection points with correct labels', () => {
    const connections = createDefaultConnections('dual_switch')
    expect(connections).toHaveLength(4)
    expect(connections[0].label).toBe('L1')
    expect(connections[1].label).toBe('L1')
    expect(connections[2].label).toBe('L2')
    expect(connections[3].label).toBe('L2')
  })
})

describe('existing component labels', () => {
  it('power should have N and L labels', () => {
    const connections = createDefaultConnections('power')
    expect(connections[0].label).toBe('N')
    expect(connections[1].label).toBe('L')
  })

  it('switch should have L and L labels', () => {
    const connections = createDefaultConnections('switch')
    expect(connections[0].label).toBe('L')
    expect(connections[1].label).toBe('L')
  })

  it('light should have L and N labels', () => {
    const connections = createDefaultConnections('light')
    expect(connections[0].label).toBe('L')
    expect(connections[1].label).toBe('N')
  })
})

describe('dual_switch toggle', () => {
  it('should toggle group 1 (isOn) by default', () => {
    const diagram = createCircuitDiagram('test')
    const comp = createComponent('dual_switch', 'test-sw', { x: 0, y: 0 })
    const d1 = addComponent(diagram, comp)
    expect(d1.components[0].state.isOn).toBe(true)
    const d2 = toggleSwitch(d1, comp.id)
    expect(d2.components[0].state.isOn).toBe(false)
  })

  it('should toggle group 2 (isOn2) with groupIndex=2', () => {
    const diagram = createCircuitDiagram('test')
    const comp = createComponent('dual_switch', 'test-sw', { x: 0, y: 0 })
    const d1 = addComponent(diagram, comp)
    expect(d1.components[0].state.isOn2).toBe(true)
    const d2 = toggleSwitch(d1, comp.id, 2)
    expect(d2.components[0].state.isOn2).toBe(false)
  })
})

describe('inferLineType', () => {
  it('should return L for L label', () => {
    expect(inferLineType('L')).toBe('L')
  })
  it('should return L for L1/L2 labels', () => {
    expect(inferLineType('L1')).toBe('L')
    expect(inferLineType('L2')).toBe('L')
  })
  it('should return N for N label', () => {
    expect(inferLineType('N')).toBe('N')
  })
  it('should return E for E label', () => {
    expect(inferLineType('E')).toBe('E')
  })
  it('should return E for PE label', () => {
    expect(inferLineType('PE')).toBe('E')
  })
  it('should return undefined for no label', () => {
    expect(inferLineType()).toBeUndefined()
    expect(inferLineType(undefined)).toBeUndefined()
  })
  it('should return undefined for unknown labels', () => {
    expect(inferLineType('X')).toBeUndefined()
  })
})

describe('createWire lineType inference', () => {
  it('should infer L lineType from L-labeled port', () => {
    const power = createComponent('power', '电源', { x: 0, y: 0 })
    const breaker = createComponent('circuit_breaker', '断路器', { x: 100, y: 0 })
    const lPort = power.connections.find(c => c.label === 'L')!
    const bPort = breaker.connections.find(c => c.label === 'L')!
    const wire = createWire(power.id, lPort.id, breaker.id, bPort.id, undefined, lPort.label)
    expect(wire.lineType).toBe('L')
  })

  it('should infer N lineType from N-labeled port', () => {
    const light = createComponent('light', '灯', { x: 0, y: 0 })
    const power = createComponent('power', '电源', { x: 100, y: 0 })
    const nPortLight = light.connections.find(c => c.label === 'N')!
    const nPortPower = power.connections.find(c => c.label === 'N')!
    const wire = createWire(light.id, nPortLight.id, power.id, nPortPower.id, undefined, nPortLight.label)
    expect(wire.lineType).toBe('N')
  })

  it('should leave lineType undefined when no label passed', () => {
    const wire = createWire('c1', 'p1', 'c2', 'p2')
    expect(wire.lineType).toBeUndefined()
  })
})

describe('Wire lineType', () => {
  it('should include lineType on Wire interface', () => {
    const wire: Wire = {
      id: 'test-w1',
      from: { componentId: 'c1', pointId: 'p1' },
      to: { componentId: 'c2', pointId: 'p2' },
      lineType: 'L',
    }
    expect(wire.lineType).toBe('L')
  })

  it('should allow N and E lineTypes', () => {
    const wireN: Wire = {
      id: 'test-w2',
      from: { componentId: 'c1', pointId: 'p1' },
      to: { componentId: 'c2', pointId: 'p2' },
      lineType: 'N',
    }
    const wireE: Wire = {
      id: 'test-w3',
      from: { componentId: 'c1', pointId: 'p1' },
      to: { componentId: 'c2', pointId: 'p2' },
      lineType: 'E',
    }
    expect(wireN.lineType).toBe('N')
    expect(wireE.lineType).toBe('E')
  })

  it('should allow undefined lineType for backward compat', () => {
    const wire: Wire = {
      id: 'test-w4',
      from: { componentId: 'c1', pointId: 'p1' },
      to: { componentId: 'c2', pointId: 'p2' },
    }
    expect(wire.lineType).toBeUndefined()
  })
})
