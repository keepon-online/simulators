import { useState, useCallback, useRef, useEffect } from 'react'
import type { ComponentType, Component, CircuitDiagram, Wire, ElectricalValues } from '@/types'
import { 
  createComponent, 
  createWire, 
  addComponent, 
  removeComponent,
  addWire,
  updateComponentPosition,
  toggleSwitch,
  getComponent 
} from '@/engine/models'
import { calculateCircuitState } from '@/engine/calculator'
import { detectFaults } from '@/engine/faultDetector'
import { getComponentColor } from '@/engine/componentParams'
import { CIRCUIT_EXAMPLES } from '@/data/examples'
import { applyWireUndo, pushWireUndoEntry } from '@/engine/wireUndo'

interface CircuitCanvasProps {
  diagram: CircuitDiagram
  onDiagramChange: (diagram: CircuitDiagram) => void
  selectedComponentId?: string
  onSelectComponent?: (id: string | null) => void
}

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 800
const GRID_SIZE = 20
const COMPONENT_LABEL_FONT_SIZE = 9
const COMPONENT_LABEL_COLOR = '#4b5563'
const SELECTED_STROKE_COLOR = '#2563eb'
const SELECTED_STROKE_WIDTH = 2.5

function getSignalVisual(label?: string) {
  const normalizedLabel = (label ?? '').toUpperCase()

  if (normalizedLabel.startsWith('L')) {
    return { color: '#ef4444', shape: '◆', normalizedLabel }
  }

  if (normalizedLabel === 'N') {
    return { color: '#3b82f6', shape: '●', normalizedLabel }
  }

  if (normalizedLabel === 'E' || normalizedLabel === 'PE') {
    return { color: '#22c55e', shape: '■', normalizedLabel }
  }

  return {
    color: '#6b7280',
    shape: '○',
    normalizedLabel: normalizedLabel || '?',
  }
}

function getTerminalGroup(label?: string): 'L' | 'N' | 'E' | 'OTHER' {
  const normalized = (label ?? '').toUpperCase()
  if (normalized.startsWith('L')) return 'L'
  if (normalized === 'N') return 'N'
  if (normalized === 'E' || normalized === 'PE') return 'E'
  return 'OTHER'
}

function buildMiswireFeedback(fromLabel?: string, toLabel?: string) {
  const fromGroup = getTerminalGroup(fromLabel)
  const toGroup = getTerminalGroup(toLabel)
  if (fromGroup === 'OTHER' || toGroup === 'OTHER') {
    return null
  }
  if (fromGroup === toGroup) {
    return null
  }
  return `错因：端子类型不匹配（${fromLabel ?? '?'} → ${toLabel ?? '?'}）。修复动作：请改接到同类型端子（例如 L→L、N→N、E→E）后再尝试。`
}

function renderApplianceIcon(type: ComponentType, x: number, y: number) {
  switch (type) {
    case 'refrigerator':
      return (
        <g>
          <rect x={x + 20} y={y + 8} width={20} height={30} rx={2} fill="white" opacity={0.95} />
          <line x1={x + 20} y1={y + 22} x2={x + 40} y2={y + 22} stroke="#9ca3af" strokeWidth={1} />
          <line x1={x + 38} y1={y + 14} x2={x + 38} y2={y + 18} stroke="#6b7280" strokeWidth={1.2} />
          <line x1={x + 38} y1={y + 26} x2={x + 38} y2={y + 31} stroke="#6b7280" strokeWidth={1.2} />
        </g>
      )
    case 'air_conditioner':
      return (
        <g>
          <rect x={x + 14} y={y + 10} width={32} height={10} rx={2} fill="white" opacity={0.95} />
          <line x1={x + 18} y1={y + 15} x2={x + 42} y2={y + 15} stroke="#9ca3af" strokeWidth={1} />
          <path d={`M${x + 20} ${y + 24} Q${x + 24} ${y + 28} ${x + 28} ${y + 24}`} fill="none" stroke="#e0f2fe" strokeWidth={1.5} />
          <path d={`M${x + 32} ${y + 24} Q${x + 36} ${y + 28} ${x + 40} ${y + 24}`} fill="none" stroke="#e0f2fe" strokeWidth={1.5} />
        </g>
      )
    case 'tv':
      return (
        <g>
          <rect x={x + 14} y={y + 10} width={32} height={20} rx={2} fill="white" opacity={0.95} />
          <rect x={x + 17} y={y + 13} width={26} height={14} rx={1} fill="#bfdbfe" />
          <line x1={x + 28} y1={y + 30} x2={x + 32} y2={y + 34} stroke="white" strokeWidth={1.5} />
          <line x1={x + 28} y1={y + 30} x2={x + 24} y2={y + 34} stroke="white" strokeWidth={1.5} />
        </g>
      )
    case 'washer':
      return (
        <g>
          <rect x={x + 16} y={y + 8} width={28} height={28} rx={2} fill="white" opacity={0.95} />
          <circle cx={x + 30} cy={y + 24} r={7} fill="#bfdbfe" />
          <circle cx={x + 30} cy={y + 24} r={3} fill="#93c5fd" />
          <circle cx={x + 22} cy={y + 14} r={1.2} fill="#6b7280" />
          <circle cx={x + 26} cy={y + 14} r={1.2} fill="#6b7280" />
        </g>
      )
    case 'water_heater':
      return (
        <g>
          <rect x={x + 20} y={y + 8} width={20} height={28} rx={8} fill="white" opacity={0.95} />
          <path d={`M${x + 30} ${y + 15} C${x + 26} ${y + 20}, ${x + 34} ${y + 24}, ${x + 30} ${y + 29}`} fill="none" stroke="#f97316" strokeWidth={1.8} />
        </g>
      )
    default:
      return null
  }
}

// 渲染单个元件
function renderComponent(component: Component, isSelected: boolean, values?: { current: number; power: number }) {
  const { type, position, state, name } = component
  const color = getComponentColor(type)
  const x = position.x
  const y = position.y
  
  const commonProps = {
    style: { cursor: 'pointer' } as React.CSSProperties,
  }
  
  const selectionStroke = isSelected ? SELECTED_STROKE_COLOR : 'none'
  const selectionStrokeWidth = isSelected ? SELECTED_STROKE_WIDTH : 0
  
  switch (type) {
    case 'power':
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={60} height={40} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <text x={x + 30} y={y + 25} textAnchor="middle" fill="white" fontSize={10}>⚡ {name}</text>
        </g>
      )
      
    case 'switch': {
      const isOn = state.isOn
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={30} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <line x1={x + 10} y1={y + 15} x2={x + 25} y2={y + 15} stroke="white" strokeWidth={2} />
          <line x1={x + 25} y1={y + 15} x2={x + 40} y2={isOn ? y + 25 : y + 5} stroke="white" strokeWidth={2} />
          <text x={x + 25} y={y + 42} textAnchor="middle" fill={COMPONENT_LABEL_COLOR} fontSize={COMPONENT_LABEL_FONT_SIZE}>{name}</text>
        </g>
      )
    }
      
    case 'dual_switch': {
      const isOn1 = state.isOn
      const isOn2 = state.isOn2 !== undefined ? state.isOn2 : true
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={60} height={40} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          {/* 第1组开关 */}
          <line x1={x + 10} y1={y + 10} x2={x + 25} y2={y + 10} stroke="white" strokeWidth={2} />
          <line x1={x + 25} y1={y + 10} x2={x + 50} y2={isOn1 ? y + 18 : y + 2} stroke="white" strokeWidth={2} />
          {/* 分隔线 */}
          <line x1={x + 5} y1={y + 20} x2={x + 55} y2={y + 20} stroke="white" strokeWidth={0.5} opacity={0.5} />
          {/* 第2组开关 */}
          <line x1={x + 10} y1={y + 30} x2={x + 25} y2={y + 30} stroke="white" strokeWidth={2} />
          <line x1={x + 25} y1={y + 30} x2={x + 50} y2={isOn2 ? y + 38 : y + 22} stroke="white" strokeWidth={2} />
          <text x={x + 30} y={y + 55} textAnchor="middle" fill={COMPONENT_LABEL_COLOR} fontSize={COMPONENT_LABEL_FONT_SIZE}>{name}</text>
        </g>
      )
    }
    case 'light': {
      const isLit = state.isOn && values && values.current > 0
      return (
        <g key={component.id} {...commonProps}>
          <path d={`M${x + 10} ${y + 40} L${x + 10} ${y} L${x + 40} ${y} L${x + 40} ${y + 40} Z`} fill={isLit ? '#fef08a' : '#374151'} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <path d={`M${x + 25} ${y - 10} L${x + 10} ${y} M${x + 25} ${y - 10} L${x + 40} ${y}`} stroke="#f59e0b" strokeWidth={2} fill="none" />
          <text x={x + 25} y={y + 50} textAnchor="middle" fill={COMPONENT_LABEL_COLOR} fontSize={COMPONENT_LABEL_FONT_SIZE}>{name}</text>
        </g>
      )
    }
      
    case 'outlet':
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={30} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <circle cx={x + 15} cy={y + 15} r={4} fill="white" />
          <circle cx={x + 35}cy={y + 15} r={4} fill="white" />
          <text x={x + 25} y={y + 45} textAnchor="middle" fill={COMPONENT_LABEL_COLOR} fontSize={COMPONENT_LABEL_FONT_SIZE}>{name}</text>
        </g>
      )
      
    case 'outlet_5hole':
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={40} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          {/* 三孔：上方一个圆（E/地线） */}
          <circle cx={x + 25} cy={y + 12} r={3} fill="white" />
          {/* 两孔：下方两个竖线（L/N） */}
          <line x1={x + 15} y1={y + 24} x2={x + 15} y2={y + 32} stroke="white" strokeWidth={2} />
          <line x1={x + 35} y1={y + 24} x2={x + 35} y2={y + 32} stroke="white" strokeWidth={2} />
          <text x={x + 25} y={y + 55} textAnchor="middle" fill={COMPONENT_LABEL_COLOR} fontSize={COMPONENT_LABEL_FONT_SIZE}>{name}</text>
        </g>
      )
    case 'circuit_breaker': {
      const isTripped = state.tripped
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={30} fill={isTripped ? '#dc2626' : color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <rect x={x + 15} y={y + 8} width={20} height={14} fill="white" rx={2} />
          <text x={x + 25} y={y + 20} textAnchor="middle" fill="black" fontSize={10}>{state.tripped ? '⚡' : ''}</text>
          <text x={x + 25} y={y + 45} textAnchor="middle" fill={COMPONENT_LABEL_COLOR} fontSize={COMPONENT_LABEL_FONT_SIZE}>{name}</text>
        </g>
      )
    }
      
    case 'fuse': {
      const isBlown = state.blown
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={20} fill={isBlown ? '#dc2626' : color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <line x1={x + 15} y1={y + 10} x2={x + 35} y2={y + 10} stroke="white" strokeWidth={2} />
          <text x={x + 25} y={y + 35} textAnchor="middle" fill={COMPONENT_LABEL_COLOR} fontSize={COMPONENT_LABEL_FONT_SIZE}>{name}</text>
        </g>
      )
    }
      
    case 'refrigerator':
    case 'air_conditioner':
    case 'tv':
    case 'washer':
    case 'water_heater': {
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={60} height={50} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          {renderApplianceIcon(type, x, y)}
          <text x={x + 30} y={y + 65} textAnchor="middle" fill={COMPONENT_LABEL_COLOR} fontSize={COMPONENT_LABEL_FONT_SIZE}>{name}</text>
        </g>
      )
    }
      
    default:
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={30} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <text x={x + 25} y={y + 18} textAnchor="middle" fill="white" fontSize={10}>{type}</text>
        </g>
      )
  }
}

// 渲染导线
function renderWire(
  wire: Wire, 
  components: Component[],
  electricalValues: Map<string, ElectricalValues>
) {
  const fromComponent = components.find(c => c.id === wire.from.componentId)
  const toComponent = components.find(c => c.id === wire.to.componentId)
  
  if (!fromComponent || !toComponent) return null
  
  const fromPoint = fromComponent.connections.find(c => c.id === wire.from.pointId) || fromComponent.connections[0]
  const toPoint = toComponent.connections.find(c => c.id === wire.to.pointId) || toComponent.connections[0]
  
  if (!fromPoint || !toPoint) return null
  
  const wireLabel = fromPoint?.label || ''
  const wireSignal = getSignalVisual(wireLabel)
  const wireColor = wireSignal.color
  
  const isNWire = wireLabel.toUpperCase() === 'N'
  const isEWire = wireLabel.toUpperCase() === 'E' || wireLabel.toUpperCase() === 'PE'
  const strokeWidth = isNWire ? 2 : isEWire ? 2 : 2.5
  const strokeDasharray = isEWire ? '6 3' : undefined
  
  const x1 = fromComponent.position.x + fromPoint.x
  const y1 = fromComponent.position.y + fromPoint.y
  const x2 = toComponent.position.x + toPoint.x
  const y2 = toComponent.position.y + toPoint.y
  
  const fromCurrent = electricalValues.get(fromComponent.id)?.current || 0
  const toCurrent = electricalValues.get(toComponent.id)?.current || 0
  const hasCurrent = fromCurrent > 0.01 || toCurrent > 0.01
  
  let direction: 'forward' | 'backward' | 'none' = 'none'
  if (isNWire) {
    if (toComponent.type === 'power') direction = 'forward'
    else if (fromComponent.type === 'power') direction = 'backward'
    else direction = 'forward'
  } else {
    if (fromComponent.type === 'power') direction = 'forward'
    else if (toComponent.type === 'power') direction = 'backward'
    else if (fromCurrent > toCurrent) direction = 'forward'
    else if (toCurrent > fromCurrent) direction = 'backward'
  }
  
  const speed = Math.min(Math.max(Math.max(fromCurrent, toCurrent) / 10, 0.3), 2)
  
  return (
    <g key={wire.id}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={wireColor} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      {hasCurrent && direction !== 'none' && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#fbbf24"
          strokeWidth={2}
          strokeDasharray="8 4"
          style={{
            animation: `flow ${1/speed}s linear infinite`,
            animationDirection: direction === 'forward' ? 'normal' : 'reverse',
          }}
        />
      )}
    </g>
  )
}

export function CircuitCanvas({
  diagram, 
  onDiagramChange, 
  selectedComponentId,
  onSelectComponent 
}: CircuitCanvasProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [wiringFrom, setWiringFrom] = useState<{componentId: string, pointId: string, x: number, y: number, label?: string} | null>(null)
  const [wiringMousePos, setWiringMousePos] = useState<{x: number, y: number} | null>(null)
  const [showStepsOverlay, setShowStepsOverlay] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [miswireFeedback, setMiswireFeedback] = useState('')
  const [wireUndoStack, setWireUndoStack] = useState<Array<{ wires: Wire[]; reason: 'addWire'; at: number }>>([])
  const svgRef = useRef<SVGSVGElement>(null)

  const currentSteps = /^ex([1-9]|10)$/.test(diagram.id)
    ? (CIRCUIT_EXAMPLES.find((example) => example.diagram.id === diagram.id)?.steps ?? [])
    : []
  
  const circuitState = calculateCircuitState(diagram)
  const faults = detectFaults(diagram)
  
  const handleDragStart = useCallback((e: React.MouseEvent, componentId: string) => {
    const component = getComponent(diagram, componentId)
    if (!component) return
    
    const svg = svgRef.current
    if (!svg) return
    
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsDragging(true)
    setDragOffset({
      x: x - component.position.x,
      y: y - component.position.y
    })
    onSelectComponent?.(componentId)
  }, [diagram, onSelectComponent])
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && selectedComponentId) {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const x = Math.max(0, Math.min(CANVAS_WIDTH - 50, e.clientX - rect.left - dragOffset.x))
      const y = Math.max(0, Math.min(CANVAS_HEIGHT - 50, e.clientY - rect.top - dragOffset.y))
      const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE
      const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE
      onDiagramChange(updateComponentPosition(diagram, selectedComponentId, { x: snappedX, y: snappedY }))
      return
    }
    if (wiringFrom) {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      setWiringMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }, [isDragging, selectedComponentId, dragOffset, diagram, onDiagramChange, wiringFrom])
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setWiringFrom(null)
    setWiringMousePos(null)
  }, [])
  
  const handleComponentClick = useCallback((e: React.MouseEvent, componentId: string) => {
    e.stopPropagation()
    
    const component = getComponent(diagram, componentId)
    if (!component) return
    
    if (component.type === 'switch') {
      onDiagramChange(toggleSwitch(diagram, componentId))
      return
    }
    
    if (component.type === 'dual_switch') {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const clickY = e.clientY - rect.top - component.position.y
      const groupIndex: 1 | 2 = clickY < 20 ? 1 : 2
      onDiagramChange(toggleSwitch(diagram, componentId, groupIndex))
      return
    }
    
    onSelectComponent?.(componentId)
  }, [diagram, onDiagramChange, onSelectComponent])


  const handlePortMouseDown = useCallback((e: React.MouseEvent, componentId: string, pointId: string, portX: number, portY: number) => {
    e.stopPropagation()
    e.preventDefault()
    setMiswireFeedback('')
    const comp = getComponent(diagram, componentId)
    const port = comp?.connections.find(c => c.id === pointId)
    setWiringFrom({ componentId, pointId, x: portX, y: portY, label: port?.label })
  }, [diagram])

  const handlePortMouseUp = useCallback((e: React.MouseEvent, componentId: string, pointId: string) => {
    e.stopPropagation()
    if (wiringFrom && wiringFrom.componentId !== componentId) {
      const fromComponent = getComponent(diagram, wiringFrom.componentId)
      const toComponent = getComponent(diagram, componentId)
      const fromPoint = fromComponent?.connections.find((conn) => conn.id === wiringFrom.pointId)
      const toPoint = toComponent?.connections.find((conn) => conn.id === pointId)
      const feedback = buildMiswireFeedback(fromPoint?.label, toPoint?.label)
      if (feedback) {
        setMiswireFeedback(feedback)
        setWiringFrom(null)
        setWiringMousePos(null)
        return
      }
      const wire = createWire(wiringFrom.componentId, wiringFrom.pointId, componentId, pointId, undefined, fromPoint?.label)
      setWireUndoStack((stack) => pushWireUndoEntry(stack, diagram))
      onDiagramChange(addWire(diagram, wire))
    }
    setWiringFrom(null)
    setWiringMousePos(null)
  }, [wiringFrom, diagram, onDiagramChange])

  const handleUndoWire = useCallback(() => {
    const { stack: nextStack, diagram: nextDiagram } = applyWireUndo(wireUndoStack, diagram)
    setWireUndoStack(nextStack)
    if (nextDiagram !== diagram) {
      onDiagramChange(nextDiagram)
    }
  }, [diagram, onDiagramChange, wireUndoStack])
  
  const handleCanvasClick = useCallback(() => {
    onSelectComponent?.(null)
    setWiringFrom(null)
    setWiringMousePos(null)
    setMiswireFeedback('')
  }, [onSelectComponent])
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndoWire()
        return
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) {
        onDiagramChange(removeComponent(diagram, selectedComponentId))
        onSelectComponent?.(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [diagram, selectedComponentId, onDiagramChange, onSelectComponent, handleUndoWire])

  useEffect(() => {
    if (/^ex([1-9]|10)$/.test(diagram.id)) {
      const timer = window.setTimeout(() => {
        setShowStepsOverlay(true)
        setActiveStep(1)
        setMiswireFeedback('')
        setWireUndoStack([])
      }, 0)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => {
      setShowStepsOverlay(false)
      setActiveStep(1)
      setMiswireFeedback('')
      setWireUndoStack([])
    }, 0)
    return () => window.clearTimeout(timer)
  }, [diagram.id])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    const componentType = e.dataTransfer.getData('componentType') as ComponentType
    if (!componentType) return
    
    const svg = svgRef.current
    if (!svg) return
    
    const rect = svg.getBoundingClientRect()
    const x = Math.max(0, Math.min(CANVAS_WIDTH - 60, e.clientX - rect.left - 30))
    const y = Math.max(0, Math.min(CANVAS_HEIGHT - 50, e.clientY - rect.top - 25))
    
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE
    
    const component = createComponent(componentType, componentType, { x: snappedX, y: snappedY })
    onDiagramChange(addComponent(diagram, component))
  }, [diagram, onDiagramChange])
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])
  
  return (
    <div className="relative w-full h-full overflow-auto bg-gray-50">
      <svg
        ref={svgRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-200 bg-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <defs>
          <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#e5e7eb" strokeWidth={0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {diagram.wires.map(wire => renderWire(wire, diagram.components, circuitState.electricalValues))}
        
        {diagram.components.map(component => {
          const values = circuitState.electricalValues.get(component.id)
          return (
            <g key={component.id}>
              <g
                onClick={(e) => handleComponentClick(e, component.id)}
                onMouseDown={(e) => handleDragStart(e, component.id)}
                style={{ cursor: isDragging && selectedComponentId === component.id ? 'grabbing' : 'grab' }}
              >
                {renderComponent(
                  component,
                  selectedComponentId === component.id,
                  values ? { current: values.current, power: values.power } : undefined
                )}
              </g>
              {component.connections.map(conn => {
                const cx = component.position.x + conn.x
                const cy = component.position.y + conn.y
                const signalLabel = getSignalVisual(conn.label)
                const isCoreSignal = ['L', 'N', 'E', 'PE'].includes(signalLabel.normalizedLabel)
                const isWiringSource = wiringFrom?.componentId === component.id && wiringFrom.pointId === conn.id
                const isWiringCandidate = Boolean(wiringFrom && wiringFrom.componentId !== component.id)
                const isCompatiblePort = !wiringFrom || !wiringFrom.label ||
                  getTerminalGroup(wiringFrom.label) === getTerminalGroup(conn.label) ||
                  getTerminalGroup(conn.label) === 'OTHER'
                const portFill = isWiringSource ? '#f59e0b' : isWiringCandidate ? '#2563eb' : '#6b7280'
                return (
                  <g key={conn.id}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill={portFill}
                      stroke="white"
                      strokeWidth={1.5}
                      opacity={isCompatiblePort ? 1 : 0.3}
                      style={{ cursor: 'crosshair', transition: 'fill 120ms ease, opacity 120ms ease' }}
                      onMouseDown={(e) => handlePortMouseDown(e, component.id, conn.id, cx, cy)}
                      onMouseUp={(e) => handlePortMouseUp(e, component.id, conn.id)}
                    />
                    <title>{isWiringSource ? '起始连接点' : isWiringCandidate ? '可连接端子' : '连接端子'}</title>
                    {conn.label && (
                      <g>
                        {isCoreSignal ? (
                          <rect
                            x={cx - 11}
                            y={cy - 18}
                            width={22}
                            height={12}
                            rx={4}
                            fill="white"
                            opacity={0.9}
                          />
                        ) : null}
                        <text
                          x={cx}
                          y={cy - 10}
                          textAnchor="middle"
                          fontSize={isCoreSignal ? 9 : 8}
                          fontWeight="bold"
                          fill={signalLabel.color}
                          stroke="white"
                          strokeWidth={isCoreSignal ? 2.5 : 1.8}
                          paintOrder="stroke"
                          letterSpacing={0.3}
                          opacity={isCoreSignal ? 1 : 0.75}
                        >
                          {`${signalLabel.shape}${signalLabel.normalizedLabel}`}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}

        {wiringFrom && wiringMousePos && (
          <>
            <line
              x1={wiringFrom.x}
              y1={wiringFrom.y}
              x2={wiringMousePos.x}
              y2={wiringMousePos.y}
              stroke="#2563eb"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              pointerEvents="none"
            />
            <text
              x={wiringMousePos.x + 12}
              y={wiringMousePos.y - 8}
              fontSize={12}
              fontWeight="bold"
              pointerEvents="none"
              fill={
                wiringFrom.label?.toUpperCase().startsWith('L') ? '#ef4444' :
                wiringFrom.label?.toUpperCase() === 'N' ? '#3b82f6' :
                wiringFrom.label?.toUpperCase() === 'E' ? '#22c55e' : '#6b7280'
              }
            >
              {wiringFrom.label?.toUpperCase().startsWith('L') ? '火线(L)' :
               wiringFrom.label?.toUpperCase() === 'N' ? '零线(N)' :
               wiringFrom.label?.toUpperCase() === 'E' ? '地线(E)' : '连线'}
            </text>
          </>
        )}
        
        {faults.map((fault, idx) => {
          const comp = diagram.components.find(c => c.id === fault.componentId)
          if (!comp) return null
          
          const x = comp.position.x + 25
          const y = comp.position.y - 10
          
          return (
            <g key={`fault-${idx}`}>
              <circle cx={x} cy={y} r={12} fill={fault.severity === 'critical' ? '#dc2626' : fault.severity === 'error' ? '#f97316' : '#eab308'} opacity={0.9} />
              <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize={12}>!</text>
              <title>{fault.message}</title>
            </g>
          )
        })}
      </svg>

      {showStepsOverlay && currentSteps.length > 0 && (
        <div className="absolute right-4 top-4 z-20 w-80 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">接线步骤</h3>
            <button
              type="button"
              aria-label="关闭接线步骤"
              className="rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setShowStepsOverlay(false)}
            >
              ✕
            </button>
          </div>
          <ol className="space-y-2 text-sm text-gray-700">
            {currentSteps.map((item) => (
              <li
                key={item.step}
                className={`flex cursor-pointer gap-2 rounded px-1.5 py-1 ${item.step === activeStep ? 'bg-blue-50 text-blue-900' : ''}`}
                onClick={() => setActiveStep(item.step)}
              >
                <span className="font-semibold text-gray-900">{item.step}.</span>
                <span>{item.description}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!showStepsOverlay && currentSteps.length > 0 && (
        <button
          type="button"
          className="absolute right-4 top-4 z-20 rounded-md border border-gray-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-700 shadow hover:bg-white"
          onClick={() => setShowStepsOverlay(true)}
        >
          显示接线步骤
        </button>
      )}

      {miswireFeedback ? (
        <div className="absolute left-4 top-4 z-20 max-w-xl rounded-md border border-red-200 bg-red-50/95 px-3 py-2 text-sm text-red-800 shadow">
          {miswireFeedback}
        </div>
      ) : null}
    </div>
  )
}

export default CircuitCanvas
