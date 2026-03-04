import React from 'react'
import type { ComponentType } from '@/types'

interface ComponentItem {
  type: ComponentType
  name: string
  icon: React.ReactNode
  tag?: string
}

const basicComponents: ComponentItem[] = [
  {
    type: 'power',
    name: '电源',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
      </svg>
    ),
  },
  {
    type: 'switch',
    name: '开关',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    ),
  },
  {
    type: 'dual_switch',
    name: '双联双控',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        <line x1="4" y1="12" x2="20" y2="12" strokeWidth={1} />
      </svg>
    ),
  },
  {
    type: 'light',
    name: '灯具',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'outlet',
    name: '插座',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5a1 1 0 00-1 1v1.128l2.054 2.054a2 2 0 001.416-.944l1.536-1.536a2 2 0 00.942-1.416l-.286-.286z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'outlet_5hole',
    name: '五孔插座',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4 1a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zm-3 3a1 1 0 100 2 1 1 0 000-2zm-3 3a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'circuit_breaker',
    name: '断路器',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    type: 'fuse',
    name: '保险丝',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'wire',
    name: '导线',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
]

const applianceComponents: ComponentItem[] = [
  {
    type: 'refrigerator',
    name: '冰箱',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5zm2 2v6h10V7H5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'air_conditioner',
    name: '空调',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
  },
  {
    type: 'tv',
    name: '电视',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v6H5V6zm8 2v2h2V8h-2z" />
      </svg>
    ),
  },
  {
    type: 'washer',
    name: '洗衣机',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'water_heater',
    name: '热水器',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4 4 0 018.302-3.046 3.5 3.5 0 014.504 4.974A3.5 3.5 0 0115.5 17H5.5z" clipRule="evenodd" />
      </svg>
    ),
  },
]

interface SidebarProps {
  onDragStart?: (type: ComponentType) => void
}

export function Sidebar({ onDragStart }: SidebarProps) {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type)
    e.dataTransfer.effectAllowed = 'copy'
    onDragStart?.(type)
  }

  const sections: Array<{ title: string; items: ComponentItem[]; hoverClass: string; iconClass: string }> = [
    {
      title: '配电保护',
      items: basicComponents
        .filter((item) => ['power', 'circuit_breaker', 'fuse', 'wire'].includes(item.type))
        .map((item) => (item.type === 'circuit_breaker' ? { ...item, tag: 'C16' } : item)),
      hoverClass: 'hover:border-circuit-switch',
      iconClass: 'text-circuit-switch',
    },
    {
      title: '开关照明',
      items: basicComponents.filter((item) => ['switch', 'dual_switch', 'light'].includes(item.type)),
      hoverClass: 'hover:border-circuit-switch',
      iconClass: 'text-circuit-switch',
    },
    {
      title: '插座回路',
      items: basicComponents
        .filter((item) => ['outlet', 'outlet_5hole'].includes(item.type))
        .map((item) => (item.type === 'outlet_5hole' ? { ...item, tag: '30mA' } : item)),
      hoverClass: 'hover:border-circuit-switch',
      iconClass: 'text-circuit-switch',
    },
    {
      title: '常见家电',
      items: applianceComponents,
      hoverClass: 'hover:border-circuit-light',
      iconClass: 'text-circuit-light',
    },
  ]

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">元件库</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sections.map((section, index) => (
          <div key={section.title} className={index === 0 ? 'p-3' : 'p-3 pt-0'}>
            <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">{section.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {section.items.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  className={`flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 cursor-move ${section.hoverClass} hover:shadow-sm transition-all`}
                >
                  <div className={`${section.iconClass} mb-1`}>{item.icon}</div>
                  <span className="text-xs text-gray-600 leading-tight text-center">{item.name}</span>
                  {item.tag ? <span className="text-[10px] text-gray-500 mt-0.5">{item.tag}</span> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
