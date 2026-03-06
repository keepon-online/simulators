import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CircuitCanvas } from '@/components/Editor/CircuitCanvas'
import { CIRCUIT_EXAMPLES } from '@/data/examples'

function cloneDiagram<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

describe('wiring clarity behavior', () => {
  it('should close and reopen steps overlay for example diagram', async () => {
    const diagram = cloneDiagram(CIRCUIT_EXAMPLES[0].diagram)
    render(<CircuitCanvas diagram={diagram} onDiagramChange={vi.fn()} />)

    expect(await screen.findByText('接线步骤')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '关闭接线步骤' }))
    await waitFor(() => {
      expect(screen.queryByText('接线步骤')).toBeNull()
    })

    fireEvent.click(screen.getByRole('button', { name: '显示接线步骤' }))
    expect(await screen.findByText('接线步骤')).toBeTruthy()
  })

  it('should highlight selected step row when clicking a step item', async () => {
    const diagram = cloneDiagram(CIRCUIT_EXAMPLES[0].diagram)
    render(<CircuitCanvas diagram={diagram} onDiagramChange={vi.fn()} />)

    const stepText = await screen.findByText(/连接负载火线：开关输出端\(L\) → 灯具输入端\(L\)。/)
    fireEvent.click(stepText)

    const row = stepText.closest('li')
    expect(row).toBeTruthy()
    expect(row?.className.includes('bg-blue-50')).toBe(true)
  })
})
