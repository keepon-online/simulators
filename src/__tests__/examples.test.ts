import { describe, it, expect } from 'vitest'
import { CIRCUIT_EXAMPLES } from '../data/examples'
import { calculateCircuitState } from '../engine/calculator'

describe('家庭接线示例', () => {
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
