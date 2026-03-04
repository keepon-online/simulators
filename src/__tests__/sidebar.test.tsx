import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Sidebar from '../components/Layout/Sidebar'

describe('Sidebar 教学分组展示', () => {
  it('应展示标准教学分组标题与关键标签', () => {
    const html = renderToStaticMarkup(<Sidebar />)

    expect(html).toContain('配电保护')
    expect(html).toContain('开关照明')
    expect(html).toContain('插座回路')
    expect(html).toContain('常见家电')

    expect(html).toContain('C16')
    expect(html).toContain('30mA')
  })
})
