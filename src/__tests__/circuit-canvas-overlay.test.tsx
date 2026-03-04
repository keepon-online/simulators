import { describe, it, expect } from 'vitest'
import source from '../components/Editor/CircuitCanvas.tsx?raw'

describe('CircuitCanvas 接线步骤浮层实现', () => {
  it('包含 showStepsOverlay 状态与 ex1..ex8 的 steps 计算', () => {
    expect(source).toContain('const [showStepsOverlay, setShowStepsOverlay] = useState(false)')
    expect(source).toContain('const currentSteps = /^ex[1-8]$/.test(diagram.id)')
    expect(source).toContain("CIRCUIT_EXAMPLES.find((example) => example.diagram.id === diagram.id)?.steps ?? []")
  })

  it('包含自动打开逻辑、标题与关闭按钮', () => {
    expect(source).toContain('if (/^ex[1-8]$/.test(diagram.id))')
    expect(source).toContain('setShowStepsOverlay(true)')
    expect(source).toContain('setShowStepsOverlay(false)')
    expect(source).toContain('接线步骤')
    expect(source).toContain('aria-label="关闭接线步骤"')
    expect(source).toContain('onClick={() => setShowStepsOverlay(false)}')
  })

  it('包含无步骤时隐藏浮层的渲染条件', () => {
    expect(source).toContain('{showStepsOverlay && currentSteps.length > 0 && (')
  })
})
