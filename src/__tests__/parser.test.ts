import { describe, it, expect } from 'vitest'
import {
  createCircuitDiagram,
  createComponent,
  createWire,
  addComponent,
  addWire,
} from '../engine/models'
import {
  exportCircuitToJSON,
  exportCircuitToStorageJSON,
  importCircuitFromJSON,
  STORAGE_SCHEMA_VERSION,
} from '../engine/parser'

describe('Circuit Parser', () => {
  it('should export and import circuit JSON successfully', () => {
    let diagram = createCircuitDiagram('Parser Roundtrip')
    const power = createComponent('power', '电源', { x: 0, y: 0 })
    const light = createComponent('light', '灯具', { x: 120, y: 0 }, { power: 60 })

    diagram = addComponent(diagram, power)
    diagram = addComponent(diagram, light)
    diagram = addWire(diagram, createWire(power.id, power.connections[1].id, light.id, light.connections[0].id))

    const json = exportCircuitToJSON(diagram)
    const result = importCircuitFromJSON(json)

    expect(result.success).toBe(true)
    expect(result.diagram).toBeDefined()
    expect(result.errors).toHaveLength(0)
    expect(result.diagram?.components).toHaveLength(2)
    expect(result.diagram?.wires).toHaveLength(1)
  })

  it('should fail on invalid JSON string', () => {
    const result = importCircuitFromJSON('{ invalid json }')

    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toContain('JSON 解析错误')
  })

  it('should fail when components array is missing', () => {
    const result = importCircuitFromJSON(JSON.stringify({ id: 'x', name: 'broken' }))

    expect(result.success).toBe(false)
    expect(result.errors).toContain('无效的电路数据: 缺少 components 数组')
  })

  it('should fail validation when power source is missing', () => {
    const data = {
      id: 'diagram-1',
      name: 'No Power',
      components: [
        createComponent('light', '灯具', { x: 0, y: 0 }),
      ],
      wires: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = importCircuitFromJSON(JSON.stringify(data))

    expect(result.success).toBe(false)
    expect(result.errors).toContain('电路图中没有电源')
  })

  it('should export storage payload with schema metadata', () => {
    const diagram = createCircuitDiagram('Versioned Save')

    const json = exportCircuitToStorageJSON(diagram)
    const payload = JSON.parse(json) as {
      schema: string
      version: number
      savedAt: string
      diagram: { id: string; name: string }
    }

    expect(payload.schema).toBe('home-circuit-simulator')
    expect(payload.version).toBe(STORAGE_SCHEMA_VERSION)
    expect(payload.savedAt).toBeDefined()
    expect(payload.diagram.id).toBe(diagram.id)
    expect(payload.diagram.name).toBe('Versioned Save')
  })

  it('should import legacy diagram with migration warning', () => {
    const legacyDiagram = createCircuitDiagram('Legacy Diagram')

    const result = importCircuitFromJSON(JSON.stringify(legacyDiagram))

    expect(result.success).toBe(false)
    expect(result.warnings.some(w => w.includes('兼容模式'))).toBe(true)
  })

  it('should load circuits saved without wire lineType', () => {
    const power = createComponent('power', '电源', { x: 0, y: 0 })
    const light = createComponent('light', '灯具', { x: 120, y: 0 }, { power: 60 })
    const data = {
      schema: 'home-circuit-simulator',
      version: STORAGE_SCHEMA_VERSION,
      savedAt: '2026-01-01T00:00:00Z',
      diagram: {
        id: 'old-1',
        name: 'Old Circuit',
        components: [power, light],
        wires: [{
          id: 'w1',
          from: { componentId: power.id, pointId: power.connections[1].id },
          to: { componentId: light.id, pointId: light.connections[0].id },
        }],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    }
    const result = importCircuitFromJSON(JSON.stringify(data))
    expect(result.success).toBe(true)
    expect(result.diagram?.wires[0].lineType).toBeUndefined()
  })

  it('should reject future storage version', () => {
    const diagram = createCircuitDiagram('Future Version')
    const payload = {
      schema: 'home-circuit-simulator',
      version: STORAGE_SCHEMA_VERSION + 1,
      savedAt: new Date().toISOString(),
      diagram,
    }

    const result = importCircuitFromJSON(JSON.stringify(payload))

    expect(result.success).toBe(false)
    expect(result.errors.some(e => e.includes('版本过高'))).toBe(true)
  })
})
