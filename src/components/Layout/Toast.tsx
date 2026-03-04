interface ToastProps {
  message: string
  level?: 'success' | 'warning' | 'error'
  isClosing?: boolean
  onClose?: () => void
  onPauseChange?: (paused: boolean) => void
}

const TOAST_LEVEL_CLASSES: Record<NonNullable<ToastProps['level']>, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-800',
}

export function Toast({
  message,
  level = 'success',
  isClosing = false,
  onClose,
  onPauseChange,
}: ToastProps) {
  const animationClass = isClosing
    ? 'animate-[toast-out_180ms_ease-in_forwards]'
    : 'animate-[toast-in_180ms_ease-out]'

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => onPauseChange?.(true)}
      onMouseLeave={() => onPauseChange?.(false)}
      onFocusCapture={() => onPauseChange?.(true)}
      onBlurCapture={() => onPauseChange?.(false)}
      className={`fixed right-4 bottom-16 z-50 max-w-md rounded-lg border px-4 py-3 text-sm shadow-lg whitespace-pre-line will-change-transform motion-reduce:animate-none ${animationClass} ${TOAST_LEVEL_CLASSES[level]}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">{message}</div>
        <button
          type="button"
          aria-label="关闭提示"
          onClick={onClose}
          className="rounded px-1 text-lg leading-none opacity-70 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast
