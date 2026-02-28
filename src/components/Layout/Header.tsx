interface HeaderProps {
  title?: string
  onSave?: () => void
  onLoad?: () => void
  examples?: Array<{ name: string; description: string; diagram: import('@/types').CircuitDiagram }>
  onLoadExample?: (diagram: import('@/types').CircuitDiagram) => void
}

export function Header({ title = '家庭电路仿真系统', onSave, onLoad, examples, onLoadExample }: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-circuit-power rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onLoad}
          className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          加载
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1.5 text-sm bg-circuit-outlet hover:bg-green-600 rounded transition-colors"
        >
          保存
        </button>
        <select
          value=""
          onChange={(e) => {
            const idx = parseInt(e.target.value)
            if (!isNaN(idx) && examples && examples[idx]) {
              onLoadExample?.(examples[idx].diagram)
            }
          }}
          className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded transition-colors"
        >
          <option value="" disabled>示例电路...</option>
          {examples?.map((ex, idx) => (
            <option key={idx} value={idx}>{ex.name}</option>
          ))}
        </select>
      </div>
    </header>
  )
}

export default Header
