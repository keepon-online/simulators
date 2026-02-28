interface FooterProps {
  message?: string
  componentCount?: number
  wireCount?: number
}

export function Footer({ 
  message = '就绪', 
  componentCount = 0, 
  wireCount = 0 
}: FooterProps) {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center gap-4">
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>元件: {componentCount}</span>
        <span>导线: {wireCount}</span>
      </div>
    </footer>
  )
}

export default Footer
