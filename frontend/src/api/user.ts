import axios from 'axios'

// 配置基础 URL（假设后端运行在 localhost:8080）
const api = axios.create({
    baseURL: 'http://localhost:8080/auth',
    timeout: 10000
})

// 用户相关 API
export const userApi = {

    // 调用 /login 接口
    login(): Promise<any> {
        return api.get('/login')
    },

    // 调用 /domestic 接口
    domestic(): Promise<string> {
        return api.get('/domestic')
    }
}
