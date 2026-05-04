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

                <!-- Token tidak valid -->
                <div v-if="tokenInvalid" class="invalid-token">
                    <p>{{ t('resetPassword.invalidToken') }}</p>
                    <ion-button expand="block" class="login-btn" router-link="/forgot-password">
                        {{ t('resetPassword.requestAgain') }}
                    </ion-button>
                </div>

                <template v-else>
                    <div class="login-form">
                        <div class="form-group">
                            <ion-label>{{ t('setPassword.password') }}</ion-label>
                            <div class="input-wrapper">
                                <ion-input v-model="newPassword" type="password"
                                    :placeholder="t('setPassword.password')" class="custom-input" />
                            </div>
                            <p v-if="newPassword && newPassword.length < 8" class="field-error">
                                {{ t('setPassword.passwordMin') }}
                            </p>
                        </div>

                        <div class="form-group">
                            <ion-label>{{ t('setPassword.repeatPassword') }}</ion-label>
                            <div class="input-wrapper">
                                <ion-input v-model="confirmPassword" type="password"
                                    :placeholder="t('setPassword.repeatPassword')" class="custom-input" />
                            </div>
                            <p v-if="confirmPassword && newPassword !== confirmPassword" class="field-error">
                                {{ t('setPassword.passwordMatch') }}
                            </p>
                        </div>
                    </div>

                    <div class="login-footer">
                        <ion-button expand="block" class="login-btn" :disabled="!isFormValid || isLoading"
                            @click="handleReset">
                            <ion-spinner v-if="isLoading" name="crescent" style="width:20px;height:20px;" />
                            <span v-else>{{ t('setPassword.btn') }}</span>
                        </ion-button>
                    </div>
                </template>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonSpinner, toastController } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/auth.service'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const token = ref('')
const tokenInvalid = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const isFormValid = computed(() =>
    newPassword.value.length >= 8 && newPassword.value === confirmPassword.value
)

onMounted(() => {
    const tokenParam = route.query.token as string
    if (!tokenParam) {
        tokenInvalid.value = true
        return
    }
    token.value = tokenParam
})

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const handleReset = async () => {
    if (!isFormValid.value) return
    isLoading.value = true
    try {
        await authService.resetPassword(token.value, newPassword.value)
        showToast(t('resetPassword.successToast'), 'success')
        router.replace('/login')
    } catch (err: any) {
        const msg = err?.response?.data?.message || ''
        if (msg.includes('invalid') || msg.includes('expired')) {
            tokenInvalid.value = true
        }
        showToast(msg || t('resetPassword.failedToast'))
    } finally {
        isLoading.value = false
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
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group ion-label {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
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

.field-error {
    font-size: 13px;
    color: var(--color-red);
    margin: 0;
    letter-spacing: -0.01em;
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
}

.login-btn:not([disabled]) {
    --background: #3077E3;
}

.invalid-token {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 16px;
}

.invalid-token p {
    font-size: 16px;
    color: var(--color-red);
    text-align: center;
    margin: 0;
}
</style>