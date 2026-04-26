<template>
    <ion-page>
        <AppHeader title="Change Language" :show-back="true" back-href="/profile" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div class="form-content">
                    <!-- Language -->
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

                <!-- Save Button -->
                <div class="footer">
                    <ion-button expand="block" class="save-btn" @click="handleSave">
                        Save
                    </ion-button>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent, IonLabel, IonButton, IonIcon } from '@ionic/vue'
import { chevronDownOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'

const language = ref('en')

const handleSave = () => {
    console.log('Save language', language.value)
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

/* Select */
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

/* Footer */
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