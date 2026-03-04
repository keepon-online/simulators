import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from '../App'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App storage loading', () => {
  it('should render non-blocking error toast when stored JSON is invalid', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('{ invalid json }')
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<App />)

    fireEvent.click(screen.getByText('加载'))

    expect(alertSpy).not.toHaveBeenCalled()
    expect(screen.getByText(/加载失败：/)).toBeTruthy()
    expect(screen.getByText(/建议：/)).toBeTruthy()
  })

  it('should render upgrade suggestion toast for future storage version', () => {
    const payload = {
      schema: 'home-circuit-simulator',
      version: 999,
      savedAt: new Date().toISOString(),
      diagram: {
        id: 'future',
        name: 'Future',
        components: [],
        wires: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(payload))
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<App />)
    fireEvent.click(screen.getByText('加载'))

    expect(alertSpy).not.toHaveBeenCalled()
    expect(screen.getByText(/加载失败：/)).toBeTruthy()
    expect(screen.getByText(/升级应用/)).toBeTruthy()
  })

  it('should play exit animation before unmount when dismiss button is clicked', () => {
    vi.useFakeTimers()
    try {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('{ invalid json }')
      vi.spyOn(window, 'alert').mockImplementation(() => {})

      render(<App />)
      fireEvent.click(screen.getByText('加载'))

      expect(screen.getByText(/加载失败：/)).toBeTruthy()

      fireEvent.click(screen.getByRole('button', { name: '关闭提示' }))

      act(() => {
        vi.advanceTimersByTime(179)
      })
      expect(screen.queryByText(/加载失败：/)).toBeTruthy()

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(screen.queryByText(/加载失败：/)).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('should pause auto-dismiss while hovering toast', () => {
    vi.useFakeTimers()
    try {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('{ invalid json }')
      vi.spyOn(window, 'alert').mockImplementation(() => {})

      render(<App />)
      fireEvent.click(screen.getByText('加载'))

      const toast = screen.getByRole('status')
      expect(toast).toBeTruthy()

      fireEvent.mouseEnter(toast)
      act(() => {
        vi.advanceTimersByTime(6000)
      })
      expect(screen.queryByText(/加载失败：/)).toBeTruthy()

      fireEvent.mouseLeave(toast)
      act(() => {
        vi.advanceTimersByTime(3999)
      })
      expect(screen.queryByText(/加载失败：/)).toBeTruthy()

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(screen.queryByText(/加载失败：/)).toBeTruthy()

      act(() => {
        vi.advanceTimersByTime(180)
      })
      expect(screen.queryByText(/加载失败：/)).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })
})
