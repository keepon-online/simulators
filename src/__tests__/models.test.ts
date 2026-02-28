import { describe, it, expect } from 'vitest'
import {
  createComponent,
  createCircuitDiagram,
  createDefaultConnections,
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
