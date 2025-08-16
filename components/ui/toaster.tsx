"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  try {
    const { toasts } = useToast()

    // Verificar se toasts é válido
    if (!toasts || !Array.isArray(toasts)) {
      console.warn('Toasts inválido:', toasts)
      return (
        <ToastProvider>
          <ToastViewport />
        </ToastProvider>
      )
    }

    // Filtrar toasts inválidos e adicionar validação extra
    const validToasts = toasts.filter(toast => {
      try {
        return toast && 
          typeof toast === 'object' && 
          toast.id && 
          (toast.title || toast.description) &&
          typeof toast.id === 'string' &&
          toast.id.length > 0
      } catch (error) {
        console.error('Erro ao validar toast:', error)
        return false
      }
    })

    return (
      <ToastProvider>
        {validToasts.map(function (toast, index) {
          try {
            const { id, title, description, action, ...props } = toast
            return (
              <Toast key={id || `toast-${index}`} {...props}>
                <div className="grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
                <ToastClose />
              </Toast>
            )
          } catch (error) {
            console.error('Erro ao renderizar toast:', error)
            return null
          }
        })}
        <ToastViewport />
      </ToastProvider>
    )
  } catch (error) {
    console.error('Erro no componente Toaster:', error)
    // Retornar um Toaster vazio em caso de erro
    return (
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    )
  }
}
