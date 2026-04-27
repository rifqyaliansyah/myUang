import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(localStorage.getItem('access_token'))
    const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))

    const tempToken = ref<string | null>(null)
    const pinVerified = ref<boolean>(sessionStorage.getItem('pin_verified') === 'true')
    const sessionChecked = ref<boolean>(false)

    const user = ref<{ id: string; name: string; email: string; avatar_url?: string; quotes?: string } | null>(
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    const isAuthenticated = computed(() => !!accessToken.value && pinVerified.value)
    const hasTempToken = computed(() => !!tempToken.value)
    const isPinSet = ref<boolean>(JSON.parse(localStorage.getItem('is_pin_set') || 'false'))

    function setTokens(access: string, refresh: string) {
        accessToken.value = access
        refreshToken.value = refresh
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
    }

    function setTempToken(token: string) {
        tempToken.value = token
    }

    function setUser(userData: typeof user.value) {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function setIsPinSet(value: boolean) {
        isPinSet.value = value
        localStorage.setItem('is_pin_set', JSON.stringify(value))
    }

    function setPinVerified() {
        pinVerified.value = true
        sessionStorage.setItem('pin_verified', 'true')
    }

    function clearAuth() {
        accessToken.value = null
        refreshToken.value = null
        tempToken.value = null
        pinVerified.value = false
        sessionStorage.removeItem('pin_verified')
        user.value = null
        isPinSet.value = false
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('is_pin_set')
    }

    async function initializeAuth() {
        if (sessionChecked.value) return

        try {
            if (accessToken.value && isPinSet.value && !pinVerified.value && refreshToken.value) {
                const res = await authService.resume(refreshToken.value)
                tempToken.value = res.data.data.tempToken
            }
        } catch {
            clearAuth()
        } finally {
            sessionChecked.value = true
        }
    }

    async function refresh() {
        if (!refreshToken.value) throw new Error('No refresh token')
        const res = await authService.refresh(refreshToken.value)
        setTokens(res.data.data.accessToken, res.data.data.refreshToken)
    }

    async function logout() {
        try {
            if (refreshToken.value) {
                await authService.logout(refreshToken.value)
            }
        } finally {
            clearAuth()
        }
    }

    return {
        accessToken,
        refreshToken,
        tempToken,
        pinVerified,
        sessionChecked,
        user,
        isPinSet,
        isAuthenticated,
        hasTempToken,
        setTokens,
        setTempToken,
        setUser,
        setIsPinSet,
        initializeAuth,
        setPinVerified,
        clearAuth,
        refresh,
        logout,
    }
})