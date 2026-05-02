<template>
    <ion-page>
        <ion-content class="login-content" :fullscreen="true">
            <div class="brand-wrapper">
                <span class="brand">MyUang</span>
                <span class="brand-sub">by Me</span>
            </div>
            <div class="login-wrapper">
                <div class="login-header">
                    <h1>Login</h1>
                    <p>Please log in to enjoy all MyUang features</p>
                </div>

                <!-- Form -->
                <div class="login-form">
                    <!-- Email -->
                    <div class="form-group">
                        <ion-label>Email</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="email" type="email" placeholder="Email" class="custom-input" />
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="form-group">
                        <ion-label>Password</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="password" :type="showPassword ? 'text' : 'password'"
                                placeholder="Password" class="custom-input-password">
                                <ion-button fill="clear" slot="end" class="toggle-password"
                                    @click="showPassword = !showPassword">
                                    <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" />
                                </ion-button>
                            </ion-input>
                        </div>
                    </div>

                    <!-- Forgot Password -->
                    <div class="forgot-wrapper">
                        <ion-button fill="clear" class="forgot-btn" @click="$router.push('/forgot-password')">
                            Forgot Password?
                        </ion-button>
                    </div>

                    <p class="or-text">or Login with</p>

                    <!-- Google Login -->
                    <div class="social-wrapper">
                        <!-- Hidden Google button, tetap ke-render di DOM -->
                        <div ref="googleBtnRef" class="google-btn-hidden"></div>

                        <!-- Tampilan button tetap seperti semula -->
                        <ion-button fill="outline" class="google-btn" @click="loginWithGoogle">
                            <img src="/assets/icon/google.svg" alt="Google" class="google-icon" />
                        </ion-button>
                    </div>
                </div>

                <!-- Footer -->
                <div class="login-footer">
                    <ion-button expand="block" class="login-btn" :disabled="!email || !password" @click="handleLogin">
                        Login
                        <ion-icon :icon="chevronForwardOutline" slot="end" />
                    </ion-button>

                    <p class="signup-text">
                        Don't have an account?
                        <ion-button fill="clear" class="signup-btn" router-link="/signup">
                            Sign Up
                        </ion-button>
                    </p>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonIcon, loadingController, toastController } from '@ionic/vue'
import { eyeOutline, eyeOffOutline, chevronForwardOutline } from 'ionicons/icons'
import authService from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const googleBtnRef = ref<HTMLElement | null>(null)

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

function extractErrorMessage(err: any): string {
    const data = err.response?.data
    if (!data) return 'Login failed'

    if (data.errors?.length > 0) {
        return data.errors[0].msg === 'Invalid value' && data.errors[0].path === 'email'
            ? 'Invalid email format'
            : data.errors[0].msg
    }

    return data.message || 'Login failed'
}

/**
 * Determine redirect after Google auth based on hasPassword and isPinSet.
 * - No password yet  → /set-password (set password first, then setup-pin)
 * - Has password, no PIN → /setup-pin
 * - Has password, has PIN → /verify-pin
 */
function resolveGoogleRedirect(hasPassword: boolean, isPinSet: boolean): string {
    if (!hasPassword) return '/set-password'
    return isPinSet ? '/verify-pin' : '/setup-pin'
}

const loginWithGoogle = () => {
    // @ts-ignore
    google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        use_fedcm_for_prompt: false,
        callback: async (response: { credential: string }) => {
            const loading = await loadingController.create({ message: 'Signing in...' })
            await loading.present()

            try {
                const res = await authService.googleAuth(response.credential)
                const { user, tempToken, isPinSet, hasPassword } = res.data.data

                auth.setUser(user)
                auth.setTempToken(tempToken)
                auth.setIsPinSet(isPinSet)

                router.replace(resolveGoogleRedirect(hasPassword, isPinSet))
            } catch (err: any) {
                showToast(err.response?.data?.message || 'Google sign in failed')
            } finally {
                await loading.dismiss()
            }
        },
    })

    // @ts-ignore
    google.accounts.id.renderButton(googleBtnRef.value, {
        theme: 'outline',
        size: 'large',
    })

    const googleBtn = googleBtnRef.value?.querySelector('div[role=button]') as HTMLElement
    googleBtn?.click()
}

const handleLogin = async () => {
    const loading = await loadingController.create({ message: 'Logging in...' })
    await loading.present()

    try {
        const res = await authService.login({ email: email.value, password: password.value })
        const { user, tempToken, isPinSet } = res.data.data

        auth.setUser(user)
        auth.setTempToken(tempToken)
        auth.setIsPinSet(isPinSet)

        router.replace(isPinSet ? '/verify-pin' : '/setup-pin')
    } catch (err: any) {
        showToast(extractErrorMessage(err))
    } finally {
        await loading.dismiss()
    }
}
</script>

<style scoped>
.login-content {
    --background: var(--color-white);
}

.login-wrapper {
    display: flex;
    flex-direction: column;
    min-height: calc(100% - 48px);
    padding: 24px 16px 24px;
    box-sizing: border-box;
}

.brand-wrapper {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 4px;
    padding: 24px 16px 0;
}

.brand {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    line-height: 1.2;
}

.brand-sub {
    font-size: 10px;
    font-weight: 400;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
    line-height: 1.2;
}

/* Header */
.login-header {
    margin-bottom: 32px;
}

.login-header h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin: 0 0 8px;
}

.login-header p {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
    margin: 0;
}

/* Form */
.login-form {
    flex: 1;
}

.form-group {
    margin-bottom: 8px;
}

.form-group ion-label {
    display: block;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin-bottom: 8px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background-color: var(--color-bg-4);
    border-radius: 8px;
    padding: 0 12px;
}

.custom-input {
    --background: transparent;
    --color: var(--color-black-100);
    --placeholder-color: var(--color-black-60);
    --padding-start: 0;
    --padding-end: 0;
    --padding-top: 12px;
    --padding-bottom: 12px;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    flex: 1;
}

.custom-input-password {
    --background: transparent;
    --color: var(--color-black-100);
    --placeholder-color: var(--color-black-60);
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    flex: 1;
}

.toggle-password {
    --color: var(--color-black-100);
    --padding-start: 8px;
    --padding-end: 0;
    margin: 0;
    height: 32px;
}

/* Forgot */
.forgot-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: -8px;
    margin-bottom: 18px;
}

.forgot-btn {
    color: #3077E3;
    --text-transform: none;
    --padding-start: 0;
    --padding-end: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    margin: 0;
    height: auto;
}

/* Or */
.or-text {
    text-align: center;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
    margin: 0 0 16px;
}

/* Google */
.social-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
}

.google-btn-hidden {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.google-btn {
    --border-color: var(--color-black-40);
    --border-radius: 8px;
    --color: var(--color-black-100);
    width: 100%;
    height: 48px;
}

.google-icon {
    width: 24px;
    height: 24px;
}

/* Footer */
.login-footer {
    padding-top: 16px;
}

.login-btn {
    --background: var(--color-black-40);
    --background-activated: var(--color-primary-1);
    --border-radius: 8px;
    --color: var(--color-white);
    --box-shadow: none;
    height: 40px;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
}

.login-btn:not([disabled]) {
    --background: #3077E3;
}

.signup-text {
    text-align: center;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
}

.signup-btn {
    color: #3077E3;
    --padding-start: 4px;
    --padding-end: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    margin: 0;
    height: auto;
}
</style>