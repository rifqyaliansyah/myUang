<template>
    <ion-page>
        <AppHeader title="Help Center" :show-back="true" back-href="/profile" :show-menu="false" />
        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="about-card">
                    <div class="about-label">{{ t('helpCenter.needHelp') }}</div>
                    <div class="about-body">{{ t('helpCenter.body') }}</div>
                </div>
                <div class="divider" />
                <div class="about-card">
                    <div class="about-label">{{ t('helpCenter.contactLabel') }}</div>
                    <div class="contact-list">
                        <div class="contact-item">
                            <a class="contact-item" href="mailto:rifqyaliansyahdev@gmail.com">
                                <ion-icon :icon="mailOutline" class="contact-icon" />
                                <div class="contact-info">
                                    <span class="contact-label">{{ t('helpCenter.emailLabel') }}</span>
                                    <span class="contact-value">rifqyaliansyahdev@gmail.com</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import AppHeader from '../components/AppHeader.vue'
import { mailOutline } from 'ionicons/icons'

const { t } = useI18n()
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
    padding: 16px;
}

.about-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
}

.about-label {
    font-size: 13px;
    font-weight: 600;
    color: #3077E3;
    letter-spacing: -0.01em;
}

.about-body {
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-80);
    letter-spacing: -0.02em;
    line-height: 24px;
}

.about-footer {
    font-size: 13px;
    font-weight: 400;
    color: var(--color-black-40);
    letter-spacing: -0.01em;
}

.divider {
    height: 1px;
    background: var(--color-black-20);
}

.contact-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 4px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.contact-icon {
    font-size: 22px;
    color: #3077E3;
    flex-shrink: 0;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.contact-label {
    font-size: 13px;
    font-weight: 400;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
}

.contact-value {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-black-100);
    letter-spacing: -0.02em;
}

a.contact-item {
    text-decoration: none;
}
</style>