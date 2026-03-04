import { describe, it, expect } from 'vitest'
import { CIRCUIT_EXAMPLES } from '../data/examples'
import { calculateCircuitState } from '../engine/calculator'

describe('家庭接线示例', () => {
  it('标准教学包包含 8 个示例且每个示例带教学标签与接线步骤', () => {
    expect(CIRCUIT_EXAMPLES).toHaveLength(8)
    CIRCUIT_EXAMPLES.forEach((example) => {
      expect(example.teachingLabel).toBeTruthy()
      expect(example.teachingTag).toBeTruthy()
      expect(example.steps?.length ?? 0).toBeGreaterThan(0)
    })
  })

  CIRCUIT_EXAMPLES.forEach(example => {
    describe(example.name, () => {
      it('电路应有效', () => {
        const state = calculateCircuitState(example.diagram)
        expect(state.isValid).toBe(true)
      })
      it('总功率应大于 0', () => {
        const state = calculateCircuitState(example.diagram)
        expect(state.totalPower).toBeGreaterThan(0)
      })
    })
  })
})
