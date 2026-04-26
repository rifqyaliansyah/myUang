<template>
    <ion-page>
        <AppHeader title="Edit Profile" :show-back="true" back-href="/profile" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div class="form-content">

                    <!-- Avatar -->
                    <div class="avatar-section">
                        <div class="avatar-wrapper">
                            <img src="https://umj.ac.id/storage/2024/10/parb.jpg" alt="avatar" class="avatar-img" />
                            <div class="avatar-edit-btn" @click="handleChangePhoto">
                                <img src="/assets/icon/pen-solid.svg" class="edit-icon" />
                            </div>
                        </div>
                    </div>

                    <!-- Name -->
                    <div class="form-group">
                        <ion-label>Name</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="name" type="text" placeholder="Name" class="custom-input" />
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="form-group">
                        <ion-label>Email</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="email" type="email" placeholder="Email" class="custom-input" />
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
                    <ion-button expand="block" class="save-btn" :disabled="!name || !email" @click="handleSave">
                        Save
                    </ion-button>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/vue'
import AppHeader from '../components/AppHeader.vue'

const name = ref('Kevin Tan')
const email = ref('kevintan@gmail.com')
const quotes = ref('"A budget is telling your money where to go instead of wondering where it went."')

const handleChangePhoto = () => {
    console.log('Change photo')
}

const handleSave = () => {
    console.log('Save', { name: name.value, email: email.value, quotes: quotes.value })
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
    border: 2px solid var(--color-bg-2);
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