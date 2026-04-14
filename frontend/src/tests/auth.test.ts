// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('初始状态应为未登录', () => {
    const auth = useAuthStore()
    expect(auth.isLogin).toBe(false)
    expect(auth.accessToken).toBe(null)
  })

  it('登录成功应设置 Token 和用户信息并重置重试次数', () => {
    const auth = useAuthStore()
    auth.handleLoginFailure() // 模拟失败一次
    
    const mockData = {
      token: 'jwt-token-123',
      userId: 1,
      username: 'testuser',
      nickname: '测试用户',
      avatar: 'avatar-url',
      permissions: ['view_products', 'buy']
    }
    auth.login(mockData)
    
    expect(auth.isLogin).toBe(true)
    expect(auth.accessToken).toBe('jwt-token-123')
    expect(auth.userInfo?.userId).toBe(1)
    expect(auth.loginAttempts).toBe(0)
    expect(auth.showCaptcha).toBe(false)
  })

  it('连续 3 次登录失败应触发图形验证码', () => {
    const auth = useAuthStore()
    expect(auth.showCaptcha).toBe(false)
    
    auth.handleLoginFailure()
    auth.handleLoginFailure()
    expect(auth.showCaptcha).toBe(false)
    
    auth.handleLoginFailure()
    expect(auth.showCaptcha).toBe(true)
  })

  it('权限菜单应根据用户 permissions 自动计算', () => {
    const auth = useAuthStore()
    auth.login({
      token: 'token',
      userId: 1,
      username: 'u',
      nickname: 'n',
      avatar: 'a',
      permissions: ['p1', 'p2']
    })
    
    expect(auth.permissionMenu).toContain('p1')
    expect(auth.permissionMenu).toContain('p2')
  })

  it('登出应清除所有敏感状态', () => {
    // 使用 vi.stubGlobal 模拟 window.location
    vi.stubGlobal('location', { href: '' })
    
    const auth = useAuthStore()
    auth.login({
      token: 'token',
      userId: 1,
      username: 'u',
      nickname: 'n',
      avatar: 'a',
      permissions: []
    })
    
    auth.logout()
    expect(auth.isLogin).toBe(false)
    expect(auth.accessToken).toBe(null)
    
    vi.unstubAllGlobals()
  })
})
