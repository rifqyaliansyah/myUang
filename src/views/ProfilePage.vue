<template>
    <ion-page>
        <AppHeader title="Profile" :show-back="false" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <!-- Profile Info -->
                <div class="profile-section">
                    <div class="avatar">
                        <img :src="avatarUrl" alt="avatar" />
                    </div>
                    <div class="profile-info">
                        <div class="profile-name">{{ userName }}</div>
                        <div class="profile-email">{{ userEmail }}</div>
                        <div class="edit-profile" @click="handleEditProfile">{{ t('profile.editProfile') }}</div>
                    </div>
                </div>

                <!-- Quote -->
                <div class="quote-section" v-if="userQuotes">
                    <p class="quote-text">"{{ userQuotes }}"</p>
                </div>

                <!-- Divider -->
                <div class="divider" />

                <!-- Menu List -->
                <div class="menu-list">
                    <div class="menu-item" @click="handleLanguage">
                        <span class="menu-label">{{ t('profile.language') }}</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                    <div class="menu-item" @click="handleAboutUs">
                        <span class="menu-label">{{ t('profile.aboutUs') }}</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                    <div class="menu-item" @click="handleSecurity">
                        <span class="menu-label">{{ t('profile.security') }}</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                    <div class="menu-item" @click="handleHelpCenter">
                        <span class="menu-label">{{ t('profile.helpCenter') }}</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                    <div class="menu-item" @click="handleLogOut">
                        <span class="menu-label">{{ t('profile.logOut') }}</span>
                        <ion-icon :icon="chevronForwardOutline" class="menu-chevron" />
                    </div>
                    <div class="divider" />
                </div>

                <!-- Version -->
                <!-- <div class="version-text">v1.4.11</div>
                <div class="copyright-text">© {{ currentYear }} MyUang. All rights reserved.</div> -->

            </div>
        </ion-content>

        <!-- Logout Confirmation Modal -->
        <ion-alert :is-open="showLogoutAlert" :header="t('profile.logOutHeader')" :message="t('profile.logOutMessage')"
            :buttons="logoutButtons"
            @didDismiss="showLogoutAlert = false" class="logout-alert" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonIcon, IonAlert } from '@ionic/vue'
import { chevronForwardOutline } from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import AppHeader from './components/AppHeader.vue'
import profileService from '@/services/profile.service'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEFAULT_AVATAR = '/assets/image/default.jpg'

const router = useRouter()
const auth = useAuthStore()

const currentYear = new Date().getFullYear()
const showLogoutAlert = ref(false)

const avatarUrl = computed(() => auth.user?.avatar_url || DEFAULT_AVATAR)
const userName = computed(() => auth.user?.name || '')
const userEmail = computed(() => auth.user?.email || '')
const userQuotes = computed(() => auth.user?.quotes || '')

onMounted(async () => {
    try {
        const res = await profileService.getProfile()
        auth.setUser(res.data.data)
    } catch {
        // gunakan data dari localStorage jika gagal
    }
})

const logoutButtons = computed(() => [
    {
        text: 'No',
        role: 'cancel',
        cssClass: 'alert-btn-no',
        handler: () => { showLogoutAlert.value = false },
    },
    {
        text: 'Yes',
        cssClass: 'alert-btn-yes-danger',
        handler: async () => {
            showLogoutAlert.value = false
            await auth.logout()
            router.replace('/login')
        },
    },
])

const handleEditProfile = () => router.push('/edit-profile')
const handleLanguage = () => router.push('/language')
const handleAboutUs = () => router.push('/about-us')
const handleSecurity = () => router.push('/security')
const handleHelpCenter = () => router.push('/help-center')
const handleLogOut = () => { showLogoutAlert.value = true }
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
    padding: 24px 16px;
    box-sizing: border-box;
}

/* Profile Section */
.profile-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
}

.avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid #3077E3;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.profile-name {
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.profile-email {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--color-black-60);
}

.edit-profile {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #3077E3;
    cursor: pointer;
    margin-top: 2px;
}

/* Quote */
.quote-section {
    margin-bottom: 24px;
}

.quote-text {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    text-align: center;
    margin: 0 auto;
    max-width: 280px;
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

/* Version */
.version-text {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--color-black-60);
    margin-top: auto;
    padding-top: 24px;
}

.copyright-text {
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: var(--color-black-60);
    padding-top: 4px;
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
    width: 147.5px !important;
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
    width: 147.5px !important;
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