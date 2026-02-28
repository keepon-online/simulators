import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
  headerProps?: {
    title?: string
    onSave?: () => void
    onLoad?: () => void
    examples?: Array<{ name: string; description: string; diagram: import('@/types').CircuitDiagram }>
    onLoadExample?: (diagram: import('@/types').CircuitDiagram) => void
  }
  sidebarProps?: {
    onDragStart?: (type: import('@/types').ComponentType) => void
  }
  footerProps?: {
    message?: string
    componentCount?: number
    wireCount?: number
  }
}

export function Layout({ 
  children, 
  headerProps, 
  sidebarProps, 
  footerProps 
}: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header {...headerProps} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar {...sidebarProps} />
        <main className="flex-1 bg-white overflow-auto">
          {children}
        </main>
      </div>
      <Footer {...footerProps} />
    </div>
  )
}

export default Layout
