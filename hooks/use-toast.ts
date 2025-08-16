import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  try {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
  } catch (error) {
    console.error('Erro ao gerar ID:', error)
    // Fallback para ID único
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  try {
    if (toastTimeouts.has(toastId)) {
      return
    }

    const timeout = setTimeout(() => {
      try {
        toastTimeouts.delete(toastId)
        dispatch({
          type: "REMOVE_TOAST",
          toastId: toastId,
        })
      } catch (error) {
        console.error('Erro ao remover toast da fila:', error)
      }
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
  } catch (error) {
    console.error('Erro ao adicionar toast na fila de remoção:', error)
  }
}

export const reducer = (state: State, action: Action): State => {
  try {
    switch (action.type) {
      case "ADD_TOAST":
        // Validar toast antes de adicionar
        if (!action.toast || !action.toast.id) {
          console.error('Toast inválido:', action.toast)
          return state
        }
        return {
          ...state,
          toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
        }

      case "UPDATE_TOAST":
        // Validar toast antes de atualizar
        if (!action.toast || !action.toast.id) {
          console.error('Toast inválido para atualização:', action.toast)
          return state
        }
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === action.toast.id ? { ...t, ...action.toast } : t
          ),
        }

      case "DISMISS_TOAST": {
        const { toastId } = action

        try {
          // ! Side effects ! - This could be extracted into a dismissToast() action,
          // but I'll keep it here for simplicity
          if (toastId) {
            addToRemoveQueue(toastId)
          } else {
            state.toasts.forEach((toast) => {
              addToRemoveQueue(toast.id)
            })
          }
        } catch (error) {
          console.error('Erro ao adicionar toast na fila de remoção:', error)
        }

        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId || toastId === undefined
              ? {
                  ...t,
                  open: false,
                }
              : t
          ),
        }
      }
      case "REMOVE_TOAST":
        if (action.toastId === undefined) {
          return {
            ...state,
            toasts: [],
          }
        }
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        }
      default:
        return state
    }
  } catch (error) {
    console.error('Erro no reducer de toast:', error)
    return state
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  try {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
      try {
        listener(memoryState)
      } catch (error) {
        console.error('Erro ao executar listener:', error)
      }
    })
  } catch (error) {
    console.error('Erro na função dispatch:', error)
  }
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  try {
    const id = genId()

    const update = (props: ToasterToast) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      })
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    // Validar props antes de enviar
    const validProps = {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    }

    dispatch({
      type: "ADD_TOAST",
      toast: validProps,
    })

    return {
      id: id,
      dismiss,
      update,
    }
  } catch (error) {
    console.error('Erro ao criar toast:', error)
    // Retornar um toast de erro padrão
    return {
      id: 'error-toast',
      dismiss: () => {},
      update: () => {},
    }
  }
}

function useToast() {
  try {
    const [state, setState] = React.useState<State>(memoryState)

    React.useEffect(() => {
      try {
        listeners.push(setState)
        return () => {
          const index = listeners.indexOf(setState)
          if (index > -1) {
            listeners.splice(index, 1)
          }
        }
      } catch (error) {
        console.error('Erro no useEffect do useToast:', error)
        return () => {}
      }
    }, [])

    return {
      ...state,
      toast,
      dismiss: (toastId?: string) => {
        try {
          dispatch({ type: "DISMISS_TOAST", toastId })
        } catch (error) {
          console.error('Erro ao dismiss toast:', error)
        }
      },
    }
  } catch (error) {
    console.error('Erro no hook useToast:', error)
    // Retornar estado padrão em caso de erro
    return {
      toasts: [],
      toast: () => ({ id: 'error', dismiss: () => {}, update: () => {} }),
      dismiss: () => {},
    }
  }
}

export { useToast, toast }
