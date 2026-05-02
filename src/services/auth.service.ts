import api from './api'

export interface RegisterPayload {
    name: string
    email: string
    password: string
}

export interface LoginPayload {
    email: string
    password: string
}

const authService = {
    register: (data: RegisterPayload) =>
        api.post('/auth/register', data),

    login: (data: LoginPayload) =>
        api.post('/auth/login', data),

    setupPin: (pin: string, tempToken: string) =>
        api.post('/auth/setup-pin', { pin }, {
            headers: { Authorization: `Bearer ${tempToken}` }
        }),

    verifyPin: (pin: string, tempToken: string) =>
        api.post('/auth/verify-pin', { pin }, {
            headers: { Authorization: `Bearer ${tempToken}` }
        }),

    setPassword: (password: string, tempToken: string) =>
        api.post('/auth/set-password', { password }, {
            headers: { Authorization: `Bearer ${tempToken}` }
        }),

    googleAuth: (idToken: string) =>
        api.post('/auth/google', { idToken }),

    refresh: (refreshToken: string) =>
        api.post('/auth/refresh', { refreshToken }),

    logout: (refreshToken: string) =>
        api.post('/auth/logout', { refreshToken }),

    resume: (refreshToken: string) =>
        api.post('/auth/resume', { refreshToken }),
}

export default authService