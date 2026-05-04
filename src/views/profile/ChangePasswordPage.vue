<template>
    <ion-page>
        <AppHeader title="Change Password" :show-back="true" back-href="/security" :show-menu="false" />
        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="form-content">
                    <div class="form-group">
                        <ion-label>{{ t('changePassword.oldPassword') }}</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="oldPassword" :type="showOld ? 'text' : 'password'"
                                :placeholder="t('changePassword.oldPassword')" class="custom-input-password">
                                <ion-button fill="clear" slot="end" class="toggle-password" @click="showOld = !showOld">
                                    <ion-icon :icon="showOld ? eyeOffOutline : eyeOutline" />
                                </ion-button>
                            </ion-input>
                        </div>
                    </div>

                    <div class="form-group">
                        <ion-label>{{ t('changePassword.newPassword') }}</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="newPassword" :type="showNew ? 'text' : 'password'"
                                :placeholder="t('changePassword.newPassword')" class="custom-input-password">
                                <ion-button fill="clear" slot="end" class="toggle-password" @click="showNew = !showNew">
                                    <ion-icon :icon="showNew ? eyeOffOutline : eyeOutline" />
                                </ion-button>
                            </ion-input>
                        </div>
                        <p v-if="newPassword && newPassword.length < 8" class="error-text">
                            {{ t('changePassword.passwordMin') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <ion-label>{{ t('changePassword.confirmPassword') }}</ion-label>
                        <div class="input-wrapper" :class="{ 'input-error': confirmPassword && !passwordMatch }">
                            <ion-input v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'"
                                :placeholder="t('changePassword.confirmPassword')" class="custom-input-password">
                                <ion-button fill="clear" slot="end" class="toggle-password"
                                    @click="showConfirm = !showConfirm">
                                    <ion-icon :icon="showConfirm ? eyeOffOutline : eyeOutline" />
                                </ion-button>
                            </ion-input>
                        </div>
                        <p v-if="confirmPassword && !passwordMatch" class="error-text">
                            {{ t('changePassword.passwordMatch') }}
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <ion-button expand="block" class="save-btn" :disabled="!isFormValid || loading"
                        @click="handleSubmit">
                        <ion-spinner v-if="loading" name="crescent" />
                        <span v-else>{{ t('changePassword.btn') }}</span>
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
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonIcon, IonSpinner, toastController } from '@ionic/vue'
import { eyeOutline, eyeOffOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import authService from '@/services/auth.service'

const router = useRouter()
const { t } = useI18n()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showOld = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const loading = ref(false)

const passwordMatch = computed(() => newPassword.value === confirmPassword.value)
const isFormValid = computed(() =>
    oldPassword.value.length > 0 && newPassword.value.length >= 8 &&
    confirmPassword.value.length > 0 && passwordMatch.value
)

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const handleSubmit = async () => {
    if (!isFormValid.value) return
    loading.value = true
    try {
        await authService.changePassword(oldPassword.value, newPassword.value)
        showToast(t('changePassword.toastSuccess'), 'success')
        router.replace('/security')
    } catch (err: any) {
        showToast(err.response?.data?.message || t('changePassword.toastFailed'))
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.page-content::part(scroll) {
    scrollbar-width: none;
}

.page-content::part(scroll)::-webkit-scrollbar {
    display: none;
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
}

.form-content {
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
    font-weight: 400;
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

.input-wrapper.input-error {
    border: 1px solid #e53935;
}

.error-text {
    font-size: 12px;
    color: #e53935;
    margin: 0;
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

.footer {
    padding-top: 16px;
}

.save-btn {
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
    margin: 0;
}

.save-btn:not([disabled]) {
    --background: #3077E3;
}
</style>