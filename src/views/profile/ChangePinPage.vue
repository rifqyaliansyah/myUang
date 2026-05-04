<template>
    <ion-page>
        <AppHeader title="Change PIN" :show-back="true" back-href="/security" :show-menu="false" />
        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="pin-header">
                    <h2>{{ stepTitle }}</h2>
                    <p>{{ stepSubtitle }}</p>
                </div>

                <div class="pin-dots">
                    <div v-for="i in 4" :key="i" class="pin-dot"
                        :class="{ filled: currentPin.length >= i, error: !!errorMessage }" />
                </div>

                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                <div class="spacer" />

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
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, toastController } from '@ionic/vue'
import AppHeader from '../components/AppHeader.vue'
import authService from '@/services/auth.service'

const router = useRouter()
const { t } = useI18n()

type Step = 'verify' | 'create' | 'confirm'
const step = ref<Step>('verify')
const currentPin = ref('')
const oldPin = ref('')
const newPin = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const stepTitle = computed(() => {
    if (step.value === 'verify') return t('changePin.verifyTitle')
    if (step.value === 'create') return t('changePin.createTitle')
    return t('changePin.confirmTitle')
})
const stepSubtitle = computed(() => {
    if (step.value === 'verify') return t('changePin.verifySubtitle')
    if (step.value === 'create') return t('changePin.createSubtitle')
    return t('changePin.confirmSubtitle')
})

const keyboardRows = [
    ['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'del'],
]

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

async function handleKey(key: string) {
    if (isLoading.value) return
    if (key === 'del') {
        if (currentPin.value.length > 0) { currentPin.value = currentPin.value.slice(0, -1); errorMessage.value = '' }
        return
    }
    if (key === '' || currentPin.value.length >= 4) return
    errorMessage.value = ''
    currentPin.value += key
    if (currentPin.value.length < 4) return

    if (step.value === 'verify') { oldPin.value = currentPin.value; currentPin.value = ''; step.value = 'create'; return }
    if (step.value === 'create') { newPin.value = currentPin.value; currentPin.value = ''; step.value = 'confirm'; return }

    if (currentPin.value !== newPin.value) {
        errorMessage.value = t('changePin.pinMismatch')
        currentPin.value = ''; newPin.value = ''; step.value = 'create'
        return
    }

    isLoading.value = true
    try {
        await authService.changePin(oldPin.value, newPin.value)
        showToast(t('changePin.toastSuccess'), 'success')
        router.replace('/security')
    } catch (err: any) {
        const msg = err.response?.data?.message || t('changePin.toastFailed')
        showToast(msg)
        if (err.response?.status === 401) {
            errorMessage.value = msg
            oldPin.value = ''; newPin.value = ''; currentPin.value = ''; step.value = 'verify'
        } else {
            currentPin.value = ''; newPin.value = ''; step.value = 'create'
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: calc(100% - 56px);
    padding: 24px 16px 16px;
    box-sizing: border-box;
}

.pin-header {
    margin-bottom: 8px;
}

.pin-header h2 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin: 0 0 8px;
}

.pin-header p {
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
    transition: background 0.15s;
}

.pin-dot.filled {
    background: #3077E3;
}

.pin-dot.error {
    border-color: #E53935;
}

.pin-dot.filled.error {
    background: #E53935;
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