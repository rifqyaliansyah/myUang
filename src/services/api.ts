import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    const auth = useAuthStore()
    if (auth.accessToken && !config.headers.Authorization) { 
        config.headers.Authorization = `Bearer ${auth.accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const auth = useAuthStore()
        const originalRequest = err.config

        const isTempTokenRequest = originalRequest.url?.includes('/auth/setup-pin')
            || originalRequest.url?.includes('/auth/verify-pin')

        if (err.response?.status === 401 && !originalRequest._retry && auth.refreshToken && !isTempTokenRequest) {
            originalRequest._retry = true
            try {
                await auth.refresh()
                originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`
                return api(originalRequest)
            } catch {
                auth.clearAuth()
                window.location.href = '/login'
            }
        }
        return Promise.reject(err)
    }
)

export default api