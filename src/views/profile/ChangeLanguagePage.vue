<template>
    <ion-page>
        <AppHeader title="Change Language" :show-back="true" back-href="/profile" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="form-content">
                    <div class="form-group">
                        <ion-label>Language</ion-label>
                        <div class="input-wrapper select-wrapper">
                            <select v-model="language" class="custom-select">
                                <option value="en">English</option>
                                <option value="id">Bahasa Indonesia</option>
                            </select>
                            <ion-icon :icon="chevronDownOutline" class="select-chevron" />
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <ion-button expand="block" class="save-btn" @click="showConfirm = true">
                        Save
                    </ion-button>
                </div>
            </div>
        </ion-content>

        <!-- Confirmation Alert -->
        <ion-alert :is-open="showConfirm" header="Change Language?"
            :message="`Switch to ${language === 'en' ? 'English' : 'Bahasa Indonesia'}?`" :buttons="confirmButtons"
            @didDismiss="showConfirm = false" class="language-alert" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonContent, IonLabel, IonButton, IonIcon, IonAlert, toastController } from '@ionic/vue'
import { chevronDownOutline } from 'ionicons/icons'
import { useI18n } from 'vue-i18n'
import AppHeader from '../components/AppHeader.vue'

const { locale } = useI18n()
const language = ref(localStorage.getItem('lang') || 'en')
const showConfirm = ref(false)

async function showToast(message: string, color = 'success') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const handleSave = () => {
    locale.value = language.value
    localStorage.setItem('lang', language.value)
    showConfirm.value = false
    showToast('Language changed successfully')
}

const confirmButtons = computed(() => [
    {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alert-btn-no',
        handler: () => { showConfirm.value = false }
    },
    {
        text: 'Confirm',
        cssClass: 'alert-btn-yes',
        handler: handleSave
    }
])
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

.select-wrapper {
    position: relative;
    padding-right: 36px;
}

.custom-select {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 300;
    color: var(--color-black-100);
    padding: 12px 0;
    appearance: none;
    cursor: pointer;
}

.select-chevron {
    position: absolute;
    right: 12px;
    font-size: 16px;
    color: var(--color-black-100);
    pointer-events: none;
}

.footer {
    padding-top: 16px;
}

.save-btn {
    --background: #3077E3;
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
</style>

<style>
.language-alert {
    --backdrop-opacity: 0.4;
    --border-radius: 8px;
    --min-width: 280px;
}

.language-alert .alert-wrapper {
    border-radius: 8px;
    height: 148px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
}

.language-alert .alert-head {
    padding: 16px 20px 2px;
}

.language-alert .alert-title {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: var(--color-black-100);
    letter-spacing: -0.02em;
}

.language-alert .alert-message {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: var(--color-black-60);
    padding: 2px 20px 0;
    letter-spacing: -0.02em;
}

.language-alert .alert-button-group {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 12px 16px 16px;
}

.language-alert .alert-btn-no {
    flex: 1;
    height: 48px !important;
    border: 1.5px solid #3077E3 !important;
    border-radius: 8px !important;
    color: #3077E3 !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    text-transform: none !important;
    justify-content: center !important;
}

.language-alert .alert-btn-yes {
    flex: 1;
    height: 48px !important;
    background: #3077E3 !important;
    border-radius: 8px !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    text-transform: none !important;
    justify-content: center !important;
}

.language-alert .alert-button-inner {
    justify-content: center !important;
}
</style>