import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const REMOVE_DELAY = 5000

type ToastType = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

let state: { toasts: ToastType[] } = { toasts: [] }
let listeners: Array<(s: typeof state) => void> = []
let id = 0

const notify = () => listeners.forEach((l) => l(state))

const remove = (toastId: string) => {
  state.toasts = state.toasts.filter((t) => t.id !== toastId)
  notify()
}

const toast = (props: Omit<ToastType, "id">) => {
  const toastId = (++id).toString()

  const newToast: ToastType = {
    ...props,
    id: toastId,
    open: true,
    onOpenChange: (open) => !open && dismiss(toastId),
  }

  state.toasts = [newToast, ...state.toasts].slice(0, TOAST_LIMIT)
  notify()

  setTimeout(() => remove(toastId), REMOVE_DELAY)

  return {
    id: toastId,
    dismiss: () => dismiss(toastId),
    update: (p: Partial<ToastType>) => {
      state.toasts = state.toasts.map((t) =>
        t.id === toastId ? { ...t, ...p } : t
      )
      notify()
    },
  }
}

const dismiss = (toastId?: string) => {
  if (!toastId) {
    state.toasts = []
  } else {
    state.toasts = state.toasts.map((t) =>
      t.id === toastId ? { ...t, open: false } : t
    )
  }
  notify()
}

export function useToast() {
  const [localState, setLocalState] = React.useState(state)

  React.useEffect(() => {
    listeners.push(setLocalState)
    return () => {
      listeners = listeners.filter((l) => l !== setLocalState)
    }
  }, [])

  return {
    ...localState,
    toast,
    dismiss,
  }
}

export { toast }