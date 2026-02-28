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

interface CircuitCanvasProps {
  diagram: CircuitDiagram
  onDiagramChange: (diagram: CircuitDiagram) => void
  selectedComponentId?: string
  onSelectComponent?: (id: string | null) => void
}

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 800
const GRID_SIZE = 20

// 渲染单个元件
function renderComponent(component: Component, isSelected: boolean, values?: { current: number; power: number }) {
  const { type, position, state, name } = component
  const color = getComponentColor(type)
  const x = position.x
  const y = position.y
  
  const commonProps = {
    style: { cursor: 'pointer' } as React.CSSProperties,
  }
  
  const selectionStroke = isSelected ? '#3b82f6' : 'none'
  const selectionStrokeWidth = isSelected ? 2 : 0
  
  switch (type) {
    case 'power':
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={60} height={40} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <text x={x + 30} y={y + 25} textAnchor="middle" fill="white" fontSize={10}>⚡ {name}</text>
        </g>
      )
      
    case 'switch':
      const isOn = state.isOn
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={30} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <line x1={x + 10} y1={y + 15} x2={x + 25} y2={y + 15} stroke="white" strokeWidth={2} />
          <line x1={x + 25} y1={y + 15} x2={x + 40} y2={isOn ? y + 25 : y + 5} stroke="white" strokeWidth={2} />
          <text x={x + 25} y={y + 42} textAnchor="middle" fill="#6b7280" fontSize={8}>{name}</text>
        </g>
      )
      
    case 'light':
      const isLit = state.isOn && values && values.current > 0
      return (
        <g key={component.id} {...commonProps}>
          <path d={`M${x + 10} ${y + 40} L${x + 10} ${y} L${x + 40} ${y} L${x + 40} ${y + 40} Z`} fill={isLit ? '#fef08a' : '#374151'} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <path d={`M${x + 25} ${y - 10} L${x + 10} ${y} M${x + 25} ${y - 10} L${x + 40} ${y}`} stroke="#f59e0b" strokeWidth={2} fill="none" />
          <text x={x + 25} y={y + 50} textAnchor="middle" fill="#6b7280" fontSize={8}>{name}</text>
        </g>
      )
      
    case 'outlet':
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={30} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <circle cx={x + 15} cy={y + 15} r={4} fill="white" />
          <circle cx={x + 35}cy={y + 15} r={4} fill="white" />
          <text x={x + 25} y={y + 45} textAnchor="middle" fill="#6b7280" fontSize={8}>{name}</text>
        </g>
      )
      
    case 'circuit_breaker':
      const isTripped = state.tripped
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={30} fill={isTripped ? '#dc2626' : color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <rect x={x + 15} y={y + 8} width={20} height={14} fill="white" rx={2} />
          <text x={x + 25} y={y + 20} textAnchor="middle" fill="black" fontSize={10}>{state.tripped ? '⚡' : ''}</text>
          <text x={x + 25} y={y + 45} textAnchor="middle" fill="#6b7280" fontSize={8}>{name}</text>
        </g>
      )
      
    case 'fuse':
      const isBlown = state.blown
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={50} height={20} fill={isBlown ? '#dc2626' : color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <line x1={x + 15} y1={y + 10} x2={x + 35} y2={y + 10} stroke="white" strokeWidth={2} />
          <text x={x + 25} y={y + 35} textAnchor="middle" fill="#6b7280" fontSize={8}>{name}</text>
        </g>
      )
      
    case 'refrigerator':
    case 'air_conditioner':
    case 'tv':
    case 'washer':
    case 'water_heater':
      const iconMap: Record<string, string> = {
        refrigerator: '🧊',
        air_conditioner: '❄️',
        tv: '📺',
        washer: '🧺',
        water_heater: '🚿',
      }
      return (
        <g key={component.id} {...commonProps}>
          <rect x={x} y={y} width={60} height={50} fill={color} rx={4} stroke={selectionStroke} strokeWidth={selectionStrokeWidth} />
          <text x={x + 30} y={y + 30} textAnchor="middle" fontSize={20}>{iconMap[type]}</text>
          <text x={x + 30} y={y + 65} textAnchor="middle" fill="#6b7280" fontSize={8}>{name}</text>
        </g>
      )
      
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
  
  const x1 = fromComponent.position.x + fromPoint.x
  const y1 = fromComponent.position.y + fromPoint.y
  const x2 = toComponent.position.x + toPoint.x
  const y2 = toComponent.position.y + toPoint.y
  
  const fromCurrent = electricalValues.get(fromComponent.id)?.current || 0
  const toCurrent = electricalValues.get(toComponent.id)?.current || 0
  const hasCurrent = fromCurrent > 0.01 || toCurrent > 0.01
  
  let direction: 'forward' | 'backward' | 'none' = 'none'
  if (fromComponent.type === 'power') direction = 'forward'
  else if (toComponent.type === 'power') direction = 'backward'
  else if (fromCurrent > toCurrent) direction = 'forward'
  else if (toCurrent > fromCurrent) direction = 'backward'
  
  const speed = Math.min(Math.max(Math.max(fromCurrent, toCurrent) / 10, 0.3), 2)
  
  return (
    <g key={wire.id}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6b7280" strokeWidth={3} />
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
  const [wiringFrom, setWiringFrom] = useState<{componentId: string, pointId: string, x: number, y: number} | null>(null)
  const [wiringMousePos, setWiringMousePos] = useState<{x: number, y: number} | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
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
    
    onSelectComponent?.(componentId)
  }, [diagram, onDiagramChange, onSelectComponent])


  const handlePortMouseDown = useCallback((e: React.MouseEvent, componentId: string, pointId: string, portX: number, portY: number) => {
    e.stopPropagation()
    e.preventDefault()
    setWiringFrom({ componentId, pointId, x: portX, y: portY })
  }, [])

  const handlePortMouseUp = useCallback((e: React.MouseEvent, componentId: string, pointId: string) => {
    e.stopPropagation()
    if (wiringFrom && wiringFrom.componentId !== componentId) {
      const wire = createWire(wiringFrom.componentId, wiringFrom.pointId, componentId, pointId)
      onDiagramChange(addWire(diagram, wire))
    }
    setWiringFrom(null)
    setWiringMousePos(null)
  }, [wiringFrom, diagram, onDiagramChange])
  
  const handleCanvasClick = useCallback(() => {
    onSelectComponent?.(null)
    setWiringFrom(null)
    setWiringMousePos(null)
  }, [onSelectComponent])
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) {
        onDiagramChange(removeComponent(diagram, selectedComponentId))
        onSelectComponent?.(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [diagram, selectedComponentId, onDiagramChange, onSelectComponent])
  
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
    <div className="w-full h-full overflow-auto bg-gray-50">
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
                return (
                  <circle
                    key={conn.id}
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#6b7280"
                    style={{ cursor: 'crosshair' }}
                    onMouseDown={(e) => handlePortMouseDown(e, component.id, conn.id, cx, cy)}
                    onMouseUp={(e) => handlePortMouseUp(e, component.id, conn.id)}
                  />
                )
              })}
            </g>
          )
        })}

        {wiringFrom && wiringMousePos && (
          <line
            x1={wiringFrom.x}
            y1={wiringFrom.y}
            x2={wiringMousePos.x}
            y2={wiringMousePos.y}
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="6 3"
            pointerEvents="none"
          />
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
    </div>
  )
}

export default CircuitCanvas
