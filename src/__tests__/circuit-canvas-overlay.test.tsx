import { describe, it, expect } from 'vitest'
import source from '../components/Editor/CircuitCanvas.tsx?raw'

describe('CircuitCanvas 接线步骤浮层实现', () => {
  it('包含 showStepsOverlay 状态与 ex1..ex10 的 steps 计算', () => {
    expect(source).toContain('const [showStepsOverlay, setShowStepsOverlay] = useState(false)')
    expect(source).toContain('const currentSteps = /^ex([1-9]|10)$/.test(diagram.id)')
    expect(source).toContain("CIRCUIT_EXAMPLES.find((example) => example.diagram.id === diagram.id)?.steps ?? []")
  })

  it('包含自动打开逻辑、标题与关闭按钮', () => {
    expect(source).toContain('if (/^ex([1-9]|10)$/.test(diagram.id))')
    expect(source).toContain('setShowStepsOverlay(true)')
    expect(source).toContain('setShowStepsOverlay(false)')
    expect(source).toContain('接线步骤')
    expect(source).toContain('aria-label="关闭接线步骤"')
    expect(source).toContain('onClick={() => setShowStepsOverlay(false)}')
  })

  it('包含无步骤时隐藏浮层的渲染条件', () => {
    expect(source).toContain('{showStepsOverlay && currentSteps.length > 0 && (')
  })

  it('包含 LN 三重编码与标签光晕可读性配置', () => {
    expect(source).toContain("shape: '◆'")
    expect(source).toContain("shape: '●'")
    expect(source).toContain("shape: '■'")
    expect(source).toContain("stroke=\"white\"")
    expect(source).toContain('paintOrder="stroke"')
  })

  it('包含交互可见性增强（端子状态与临时连线高亮）', () => {
    expect(source).toContain('isWiringSource')
    expect(source).toContain('isWiringCandidate')
    expect(source).toContain("const portFill = isWiringSource ? '#f59e0b' : isWiringCandidate ? '#2563eb' : '#6b7280'")
    expect(source).toContain('stroke="#2563eb"')
  })

  it('包含 wiring-only 撤回栈与 Ctrl/Cmd+Z 触发逻辑', () => {
    expect(source).toContain("setWireUndoStack((stack) => pushWireUndoEntry(stack, diagram))")
    expect(source).toContain("const { stack: nextStack, diagram: nextDiagram } = applyWireUndo(wireUndoStack, diagram)")
    expect(source).toContain("(e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey")
    expect(source).toContain('setWireUndoStack([])')
  })

  it('保留核心元器件的独立渲染入口分支', () => {
    expect(source).toContain("case 'power'")
    expect(source).toContain("case 'switch'")
    expect(source).toContain("case 'circuit_breaker'")
    expect(source).toContain("case 'light'")
    expect(source).toContain("case 'outlet'")
    expect(source).toContain("case 'outlet_5hole'")
  })
})
