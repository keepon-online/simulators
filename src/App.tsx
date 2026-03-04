import { useEffect, useState } from 'react'
import { Layout, Toast } from '@/components/Layout'
import { CircuitCanvas } from '@/components/Editor/CircuitCanvas'
import type { CircuitDiagram } from '@/types'
import { createCircuitDiagram } from '@/engine/models'
import { calculateCircuitState } from '@/engine/calculator'
import { detectFaults } from '@/engine/faultDetector'
import { exportCircuitToStorageJSON, importCircuitFromStorageJSON } from '@/engine/parser'
import { CIRCUIT_EXAMPLES } from '@/data/examples'

const STORAGE_KEY = 'circuit-diagram'
const TOAST_AUTO_DISMISS_MS = 4000
const TOAST_EXIT_ANIMATION_MS = 180

type ToastLevel = 'success' | 'warning' | 'error'

interface ToastState {
  message: string
  level: ToastLevel
}

function getLoadSuggestion(errors: string[]): string {
  const joined = errors.join('; ')

  if (joined.includes('JSON 解析错误')) {
    return '存档内容可能已损坏，请清空本地存档后重新保存。'
  }

  if (joined.includes('版本过高')) {
    return '当前应用版本较旧，请升级应用后再尝试加载该存档。'
  }

  if (joined.includes('schema 不匹配')) {
    return '该数据并非本应用存档，请确认来源后再导入。'
  }

  if (joined.includes('缺少 components 数组') || joined.includes('缺少 wires 数组')) {
    return '存档结构不完整，建议从示例电路重新开始并重新保存。'
  }

  if (joined.includes('没有电源')) {
    return '电路缺少电源元件，请补充电源后再保存。'
  }

  return '请检查存档内容后重试。'
}

function formatLoadFailureMessage(errors: string[]): string {
  const detail = errors.length > 0 ? errors.join('; ') : '未知导入错误'
  const suggestion = getLoadSuggestion(errors)
  return `加载失败：${detail}\n建议：${suggestion}`
}

function formatLoadWarningMessage(warnings: string[]): string {
  const detail = warnings.join('; ')
  const isCompatibilityMode = warnings.some(w => w.includes('兼容模式'))

  if (isCompatibilityMode) {
    return `电路已加载（兼容模式）：${detail}`
  }

  return `电路已加载（有警告）：${detail}`
}

function App() {
  const [diagram, setDiagram] = useState<CircuitDiagram>(createCircuitDiagram('我的电路'))
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [isToastPaused, setIsToastPaused] = useState(false)
  const [isToastClosing, setIsToastClosing] = useState(false)

  const dismissToast = () => {
    if (!toast || isToastClosing) {
      return
    }
    setIsToastPaused(false)
    setIsToastClosing(true)
  }

  const showToast = (message: string, level: ToastLevel = 'success') => {
    setIsToastPaused(false)
    setIsToastClosing(false)
    setToast({ message, level })
  }

  useEffect(() => {
    if (!toast || isToastPaused || isToastClosing) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsToastPaused(false)
      setIsToastClosing(true)
    }, TOAST_AUTO_DISMISS_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toast, isToastPaused, isToastClosing])

  useEffect(() => {
    if (!toast || !isToastClosing) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null)
      setIsToastClosing(false)
      setIsToastPaused(false)
    }, TOAST_EXIT_ANIMATION_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toast, isToastClosing])
  
  const circuitState = calculateCircuitState(diagram)
  const faults = detectFaults(diagram)
  
  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, exportCircuitToStorageJSON(diagram))
      showToast('电路已保存！', 'success')
    } catch (error) {
      showToast(`保存失败：${(error as Error).message}`, 'error')
    }
  }

  const handleLoad = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      showToast('没有找到保存的电路', 'warning')
      return
    }

    const result = importCircuitFromStorageJSON(saved)
    if (!result.success || !result.diagram) {
      showToast(formatLoadFailureMessage(result.errors), 'error')
      return
    }

    setDiagram(result.diagram)
    setSelectedComponentId(null)

    if (result.warnings.length > 0) {
      showToast(formatLoadWarningMessage(result.warnings), 'warning')
      return
    }

    showToast('电路已加载！', 'success')
  }

  const handleLoadExample = (exampleDiagram: CircuitDiagram) => {
    if (diagram.components.length > 0) {
      if (!window.confirm('加载示例将替换当前电路，是否继续？')) {
        return
      }
    }
    setDiagram(exampleDiagram)
    setSelectedComponentId(null)
  }

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
    <>
      <Layout
        headerProps={{
          title: '家庭电路仿真系统',
          onSave: handleSave,
          onLoad: handleLoad,
          examples: CIRCUIT_EXAMPLES,
          onLoadExample: handleLoadExample,
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

      {toast ? (
        <Toast
          message={toast.message}
          level={toast.level}
          isClosing={isToastClosing}
          onClose={dismissToast}
          onPauseChange={setIsToastPaused}
        />
      ) : null}
    </>
  )
}

export default App
