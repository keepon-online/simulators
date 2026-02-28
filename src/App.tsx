import { useState, useCallback } from 'react'
import { Layout } from '@/components/Layout'
import { CircuitCanvas } from '@/components/Editor/CircuitCanvas'
import type { ComponentType, CircuitDiagram } from '@/types'
import { createCircuitDiagram } from '@/engine/models'
import { calculateCircuitState } from '@/engine/calculator'
import { detectFaults } from '@/engine/faultDetector'
import { CIRCUIT_EXAMPLES } from '@/data/examples'

function App() {
  const [diagram, setDiagram] = useState<CircuitDiagram>(createCircuitDiagram('我的电路'))
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  
  const circuitState = calculateCircuitState(diagram)
  const faults = detectFaults(diagram)
  
  const handleSave = useCallback(() => {
    localStorage.setItem('circuit-diagram', JSON.stringify(diagram))
    alert('电路已保存！')
  }, [diagram])

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem('circuit-diagram')
    if (saved) {
      setDiagram(JSON.parse(saved))
      alert('电路已加载！')
    } else {
      alert('没有找到保存的电路')
    }
  }, [])

  const handleLoadExample = useCallback((exampleDiagram: CircuitDiagram) => {
    if (diagram.components.length > 0) {
      if (!window.confirm('加载示例将替换当前电路，是否继续？')) {
        return
      }
    }
    setDiagram(exampleDiagram)
    setSelectedComponentId(null)
  }, [diagram.components.length])

  const handleDragStart = useCallback((_type: ComponentType) => {
    // Drag handled by CircuitCanvas
  }, [])

  const getStatusMessage = () => {
    if (faults.length > 0) {
      const criticalFaults = faults.filter(f => f.severity === 'critical')
      const errorFaults = faults.filter(f => f.severity === 'error')
      if (criticalFaults.length > 0) return '⚠️ 严重故障'
      if (errorFaults.length > 0) return '⚠️ 存在故障'
      return '⚡ 警告'
    }
    if (circuitState.totalCurrent > 0) {
      return `运行中 - ${circuitState.totalCurrent.toFixed(2)}A / ${circuitState.totalPower.toFixed(0)}W`
    }
    return '就绪'
  }

  return (
    <Layout
      headerProps={{
        title: '家庭电路仿真系统',
        onSave: handleSave,
        onLoad: handleLoad,
        examples: CIRCUIT_EXAMPLES,
        onLoadExample: handleLoadExample,
      }}
      sidebarProps={{
        onDragStart: handleDragStart,
      }}
      footerProps={{
        message: getStatusMessage(),
        componentCount: diagram.components.length,
        wireCount: diagram.wires.length,
      }}
    >
      <CircuitCanvas
        diagram={diagram}
        onDiagramChange={setDiagram}
        selectedComponentId={selectedComponentId || undefined}
        onSelectComponent={setSelectedComponentId}
      />
    </Layout>
  )
}

export default App
