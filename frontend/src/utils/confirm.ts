import { createVNode, render, h } from 'vue'
import ConsoleConfirm from '../components/ConsoleConfirm.vue'

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

/**
 * 编程式调用确认弹窗
 * 遵循 B2C 高端交互规范：平滑 Spring 动效与磨砂背景
 */
export const confirm = (options: ConfirmOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    
    const vnode = createVNode(ConsoleConfirm, {
      ...options,
      onConfirm: () => {
        render(null, container)
        resolve()
      },
      onCancel: () => {
        render(null, container)
        reject()
      }
    })
    
    render(vnode, container)
    document.body.appendChild(container.firstElementChild!)
  })
}
