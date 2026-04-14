import { createVNode, render, h } from 'vue'
import ToastComponent, { type ToastType } from '../components/Toast.vue'

interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

const toast = (options: ToastOptions | string) => {
  const container = document.createElement('div')
  const opt = typeof options === 'string' ? { message: options } : options
  
  const vnode = createVNode(ToastComponent, {
    ...opt,
    onClose: () => {
      render(null, container)
      if (opt.onClose) opt.onClose()
    }
  })
  
  render(vnode, container)
  document.body.appendChild(container.firstElementChild!)
}

toast.success = (message: string, duration?: number) => toast({ message, type: 'success', duration })
toast.warning = (message: string, duration?: number) => toast({ message, type: 'warning', duration })
toast.error = (message: string, duration?: number) => toast({ message, type: 'error', duration })

export default toast
