<template>
    <ion-page>
        <ion-content class="login-content" :fullscreen="true">
            <div class="brand-wrapper">
                <span class="brand">MyUang</span>
                <span class="brand-sub">by Me</span>
            </div>
            <div class="login-wrapper">
                <div class="login-header">
                    <h1>{{ t('setPassword.title') }}</h1>
                    <p>{{ t('setPassword.subtitle') }}</p>
                </div>

                <div class="login-form">
                    <div class="form-group">
                        <ion-label>{{ t('setPassword.password') }}</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="password" :type="showPassword ? 'text' : 'password'"
                                :placeholder="t('setPassword.password')" class="custom-input-password">
                                <ion-button fill="clear" slot="end" class="toggle-password"
                                    @click="showPassword = !showPassword">
                                    <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" />
                                </ion-button>
                            </ion-input>
                        </div>
                        <p v-if="password && password.length < 8" class="error-text">
                            {{ t('setPassword.passwordMin') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <ion-label>{{ t('setPassword.repeatPassword') }}</ion-label>
                        <div class="input-wrapper" :class="{ 'input-error': repeatPassword && !passwordMatch }">
                            <ion-input v-model="repeatPassword" :type="showRepeatPassword ? 'text' : 'password'"
                                :placeholder="t('setPassword.repeatPassword')" class="custom-input-password">
                                <ion-button fill="clear" slot="end" class="toggle-password"
                                    @click="showRepeatPassword = !showRepeatPassword">
                                    <ion-icon :icon="showRepeatPassword ? eyeOffOutline : eyeOutline" />
                                </ion-button>
                            </ion-input>
                        </div>
                        <p v-if="repeatPassword && !passwordMatch" class="error-text">
                            {{ t('setPassword.passwordMatch') }}
                        </p>
                    </div>
                </div>

                <div class="login-footer">
                    <ion-button expand="block" class="login-btn" :disabled="!isFormValid" @click="handleSetPassword">
                        {{ t('setPassword.btn') }}
                        <ion-icon :icon="chevronForwardOutline" slot="end" />
                    </ion-button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonIcon, loadingController, toastController } from '@ionic/vue'
import { eyeOutline, eyeOffOutline, chevronForwardOutline } from 'ionicons/icons'
import authService from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const password = ref('')
const repeatPassword = ref('')
const showPassword = ref(false)
const showRepeatPassword = ref(false)

const passwordMatch = computed(() => password.value === repeatPassword.value)
const isFormValid = computed(() =>
    password.value.length >= 8 && repeatPassword.value.length > 0 && passwordMatch.value
)

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const handleSetPassword = async () => {
    if (!isFormValid.value) return
    const loading = await loadingController.create({ message: 'Setting password...' })
    await loading.present()
    try {
        await authService.setPassword(password.value, auth.tempToken!)
        router.replace('/setup-pin')
    } catch (err: any) {
        showToast(err.response?.data?.message || 'Failed to set password')
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

.input-wrapper.input-error {
    border: 1px solid #e53935;
}

.error-text {
    font-size: 12px;
    color: #e53935;
    margin: 4px 0 0;
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
</style>