<template>
    <ion-page>
        <AppHeader title="Security" :show-back="true" back-href="/profile" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <!-- Menu List -->
                <div class="menu-list">
                    <div class="menu-item" @click="handleChangePassword">
                        <span class="menu-label">Change Password</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                    <div class="menu-item" @click="handleChangePIN">
                        <span class="menu-label">Change PIN</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <!-- <div class="divider" />
                    <div class="menu-item" @click="handleSecurity">
                        <span class="menu-label">Security</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                    <div class="menu-item" @click="handleHelpCenter">
                        <span class="menu-label">Help Center</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                    <div class="menu-item" @click="handleLogOut">
                        <span class="menu-label">Log Out</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div> -->
                    <div class="divider" />
                </div>

                <!-- Version -->
                <!-- <div class="version-text">v1.4.11</div>
                <div class="copyright-text">© {{ currentYear }} MyUang. All rights reserved.</div> -->

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon} from '@ionic/vue'
import { chevronForwardOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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