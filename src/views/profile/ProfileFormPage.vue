<template>
    <ion-page>
        <AppHeader title="Edit Profile" :show-back="true" back-href="/profile" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div class="form-content">

                    <!-- Avatar -->
                    <div class="avatar-section">
                        <div class="avatar-wrapper">
                            <img :src="previewAvatar" alt="avatar" class="avatar-img" />
                            <div class="avatar-edit-btn" @click="triggerFilePicker">
                                <img src="/assets/icon/pen-solid.svg" class="edit-icon" />
                            </div>
                            <input ref="fileInputRef" type="file" accept="image/jpeg,image/png,image/webp"
                                style="display:none" @change="handleFileChange" />
                        </div>
                    </div>

                    <!-- Name -->
                    <div class="form-group">
                        <ion-label>Name</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="name" type="text" placeholder="Name" class="custom-input" />
                        </div>
                    </div>

                    <!-- Email (disabled) -->
                    <div class="form-group">
                        <ion-label>Email</ion-label>
                        <div class="input-wrapper input-wrapper--disabled">
                            <ion-input v-model="email" type="email" placeholder="Email" class="custom-input"
                                :disabled="true" />
                        </div>
                    </div>

                    <!-- Quotes -->
                    <div class="form-group">
                        <ion-label>Quotes</ion-label>
                        <div class="input-wrapper textarea-wrapper">
                            <textarea v-model="quotes" placeholder="Quotes" class="custom-textarea" rows="4" />
                        </div>
                    </div>

                </div>

                <!-- Save Button -->
                <div class="footer">
                    <ion-button expand="block" class="save-btn" :disabled="!name || isSubmitting" @click="handleSave">
                        <ion-spinner v-if="isSubmitting" name="crescent" style="width:20px;height:20px;" />
                        <span v-else>Save</span>
                    </ion-button>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonSpinner, toastController } from '@ionic/vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import profileService from '@/services/profile.service'

const DEFAULT_AVATAR = '/assets/image/default.jpg'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const quotes = ref('')
const avatarUrl = ref(DEFAULT_AVATAR)
const previewAvatar = ref(DEFAULT_AVATAR)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isSubmitting = ref(false)

onMounted(() => {
    name.value = auth.user?.name || ''
    email.value = auth.user?.email || ''
    quotes.value = auth.user?.quotes || ''
    avatarUrl.value = auth.user?.avatar_url || DEFAULT_AVATAR
    previewAvatar.value = auth.user?.avatar_url || DEFAULT_AVATAR
})

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const triggerFilePicker = () => {
    fileInputRef.value?.click()
}

const handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        previewAvatar.value = URL.createObjectURL(file)
    }
}

const handleSave = async () => {
    if (!name.value) return
    isSubmitting.value = true
    try {
        const res = await profileService.updateProfile({
            name: name.value,
            quotes: quotes.value,
        })
        auth.setUser(res.data.data)
        showToast('Profile updated', 'success')
        router.back()
    } catch {
        showToast('Failed to update profile')
    } finally {
        isSubmitting.value = false
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
    padding: 16px 16px 16px;
    box-sizing: border-box;
}

.form-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Avatar */
.avatar-section {
    display: flex;
    justify-content: center;
}

.avatar-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
}

.avatar-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #3077E3;
}

.avatar-edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 28px;
    height: 28px;
    background-color: #3077E3;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-white);
    font-size: 16px;
}

.edit-icon {
    width: 12px;
    height: 12px;
}

/* Form Group */
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

/* Input */
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

/* Textarea */
.textarea-wrapper {
    padding: 12px;
    align-items: flex-start;
}

.custom-textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 300;
    color: var(--color-black-100);
    resize: none;
    font-family: inherit;
    line-height: 24px;
    letter-spacing: -0.02em;
    box-sizing: border-box;
}

.custom-textarea::placeholder {
    color: var(--color-black-60);
}

/* Footer */
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