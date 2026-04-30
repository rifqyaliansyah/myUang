<template>
    <ion-page>
        <ion-content class="login-content" :fullscreen="true">
            <div class="brand-wrapper">
                <span class="brand">MyUang</span>
                <span class="brand-sub">by Me</span>
            </div>
            <div class="login-wrapper">
                <div class="login-header">
                    <h1>Enter PIN</h1>
                    <p>Enter your PIN to continue</p>
                </div>

                <div class="pin-dots">
                    <div v-for="i in 4" :key="i" class="pin-dot" :class="{ filled: currentPin.length >= i }"></div>
                </div>

                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

                <div class="spacer"></div>

                <div class="pin-keyboard">
                    <div class="keyboard-row" v-for="row in keyboardRows" :key="row.join('')">
                        <button v-for="key in row" :key="key" class="key-btn"
                            :class="{ 'key-empty': key === '', 'key-delete': key === 'del' }" @click="handleKey(key)">
                            <template v-if="key === 'del'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none">
                                    <path
                                        d="M22 3H7C6.31 3 5.77 3.35 5.41 3.88L0 12L5.41 20.12C5.77 20.64 6.31 21 7 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3ZM19 15.59L17.59 17L14 13.41L10.41 17L9 15.59L12.59 12L9 8.41L10.41 7L14 10.59L17.59 7L19 8.41L15.41 12L19 15.59Z"
                                        fill="currentColor" />
                                </svg>
                            </template>
                            <template v-else-if="key !== ''">{{ key }}</template>
                        </button>
                    </div>
                </div>

                <!-- Logout link -->
                <div class="logout-wrapper">
                    <ion-button fill="clear" class="logout-btn" @click="showLogoutAlert = true">
                        Use another account
                    </ion-button>
                </div>
            </div>
        </ion-content>

        <ion-alert :is-open="showLogoutAlert" header="Switch Account?"
            message="You will be logged out from your current account." :buttons="logoutButtons"
            @didDismiss="showLogoutAlert = false" class="logout-alert" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonButton, IonAlert, toastController } from '@ionic/vue'
import authService from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const currentPin = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const showLogoutAlert = ref(false)

const keyboardRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
]

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

async function handleKey(key: string) {
    if (isLoading.value) return

    if (key === 'del') {
        if (currentPin.value.length > 0) {
            currentPin.value = currentPin.value.slice(0, -1)
            errorMessage.value = ''
        }
        return
    }

    if (key === '' || currentPin.value.length >= 4) return

    errorMessage.value = ''
    currentPin.value += key

    if (currentPin.value.length === 4) {
        isLoading.value = true
        try {
            const res = await authService.verifyPin(currentPin.value, auth.tempToken!)
            const { accessToken, refreshToken } = res.data.data

            auth.setTokens(accessToken, refreshToken)
            auth.setPinVerified()

            router.replace('/')
        } catch (err: any) {
            errorMessage.value = err.response?.data?.message || 'Invalid PIN'
            currentPin.value = ''
        } finally {
            isLoading.value = false
        }
    }
}

const logoutButtons = computed(() => [
    {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alert-btn-no',
        handler: () => { showLogoutAlert.value = false },
    },
    {
        text: 'Switch',
        cssClass: 'alert-btn-yes-danger',
        handler: async () => {
            showLogoutAlert.value = false
            await auth.logout()
            router.replace('/login')
        },
    },
])
</script>

<style scoped>
.login-content {
    --background: var(--color-white);
}

.login-wrapper {
    display: flex;
    flex-direction: column;
    min-height: calc(100% - 48px);
    padding: 24px 16px 16px 16px;
    box-sizing: border-box;
}

.brand-wrapper {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 4px;
    padding: 24px 16px 0px 16px;
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

/* PIN Dots */
.pin-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 48px 0 48px;
}

.pin-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #3077E3;
    background: transparent;
}

.pin-dot.filled {
    background: #3077E3;
}

/* Error */
.error-message {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #E53935;
    margin: -32px 0 0;
}

/* Spacer */
.spacer {
    flex: 1;
}

/* Keyboard */
.pin-keyboard {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.keyboard-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.key-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 72px;
    border: none;
    background: transparent;
    border-radius: 12px;
    font-size: 48px;
    font-weight: 600;
    line-height: 58px;
    letter-spacing: -0.02em;
    color: var(--color-black-100, #111);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}

.key-btn:active {
    background: rgba(0, 0, 0, 0.06);
}

.key-empty {
    pointer-events: none;
}

.key-delete {
    color: var(--color-black-80, #444);
}

.key-delete svg {
    width: 28px;
    height: 28px;
}

.key-delete svg path {
    fill: currentColor;
}
</style>

<style>
.logout-alert {
    --backdrop-opacity: 0.4;
    --border-radius: 8px;
    --min-width: 280px;
}

.logout-alert .alert-wrapper {
    border-radius: 8px;
    height: 148px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
}

.logout-alert .alert-head {
    padding: 16px 20px 2px;
}

.logout-alert .alert-title {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: var(--color-black-100);
    letter-spacing: -0.02em;
}

.logout-alert .alert-message {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: var(--color-black-60);
    padding: 2px 20px 0;
    letter-spacing: -0.02em;
}

.logout-alert .alert-button-group {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 12px 16px 16px;
}

.logout-alert .alert-btn-no {
    flex: 1;
    height: 48px !important;
    border: 1.5px solid #3077E3 !important;
    border-radius: 8px !important;
    color: #3077E3 !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    letter-spacing: -0.02em;
    text-transform: none !important;
    justify-content: center !important;
}

.logout-alert .alert-btn-yes-danger {
    flex: 1;
    height: 48px !important;
    background: var(--color-red) !important;
    border-radius: 8px !important;
    color: var(--color-white) !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    letter-spacing: -0.02em;
    text-transform: none !important;
    justify-content: center !important;
}

.logout-alert .alert-button-inner {
    justify-content: center !important;
}
</style>