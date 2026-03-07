import type { CircuitDiagram, Wire } from '@/types'

export interface WireUndoEntry {
  wires: Wire[]
  reason: 'addWire'
  at: number
}

function cloneWires(wires: Wire[]): Wire[] {
  return wires.map((w) => ({ ...w, from: { ...w.from }, to: { ...w.to } }))
}

export function createWireUndoEntry(diagram: CircuitDiagram): WireUndoEntry {
  return {
    wires: cloneWires(diagram.wires),
    reason: 'addWire',
    at: Date.now(),
  }
}

export function pushWireUndoEntry(
  stack: WireUndoEntry[],
  diagram: CircuitDiagram,
  maxSize = 100,
): WireUndoEntry[] {
  const next = [...stack, createWireUndoEntry(diagram)]
  if (next.length <= maxSize) {
    return next
  }

  return next.slice(next.length - maxSize)
}

export function applyWireUndo(
  stack: WireUndoEntry[],
  diagram: CircuitDiagram,
): { stack: WireUndoEntry[]; diagram: CircuitDiagram } {
  if (stack.length === 0) {
    return { stack, diagram }
  }

  const nextStack = [...stack]
  const last = nextStack.pop()
  if (!last) {
    return { stack, diagram }
  }

  return {
    stack: nextStack,
    diagram: {
      ...diagram,
      wires: cloneWires(last.wires),
    },
  }
}
