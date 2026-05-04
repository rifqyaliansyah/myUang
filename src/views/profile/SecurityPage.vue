<template>
    <ion-page>
        <AppHeader title="Security" :show-back="true" back-href="/profile" :show-menu="false" />
        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="menu-list">
                    <div class="menu-item" @click="handleChangePassword">
                        <span class="menu-label">{{ t('security.changePassword') }}</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                    <div class="menu-item" @click="handleChangePIN">
                        <span class="menu-label">{{ t('security.changePin') }}</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import { chevronForwardOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const handleChangePassword = () => router.push('/change-password')
const handleChangePIN = () => router.push('/change-pin')
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
    padding: 16px 16px;
    box-sizing: border-box;
}

/* Divider */
.divider {
    height: 1px;
    background-color: var(--color-black-20);
}

/* Menu List */
.menu-list {
    display: flex;
    flex-direction: column;
}

.menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0;
    cursor: pointer;
}

.menu-label {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.menu-chevron {
    font-size: 20px;
    color: var(--color-black-100);
}
</style>