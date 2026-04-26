<template>
    <ion-page>
        <AppHeader :title="isEdit ? 'Edit Pocket' : 'Add Pocket'" :show-back="true" back-href="/budgeting"
            :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div class="form-content">

                    <!-- Name -->
                    <div class="form-group">
                        <ion-label>Name</ion-label>
                        <div class="input-wrapper amount-wrapper">
                            <span class="emoji-label" @click="showEmojiPicker = true">{{ emoji }}</span>
                            <ion-input v-model="name" type="text" placeholder="Name"
                                class="custom-input amount-input" />
                        </div>
                    </div>

                    <!-- Amount -->
                    <div class="form-group">
                        <ion-label>Amount</ion-label>
                        <div class="input-wrapper amount-wrapper">
                            <span class="currency-label">IDR</span>
                            <ion-input v-model="displayAmount" type="text" inputmode="numeric" placeholder="0"
                                class="custom-input amount-input" @ionInput="handleAmountInput" />
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="form-group">
                        <ion-label>Description (Optional)</ion-label>
                        <div class="input-wrapper textarea-wrapper">
                            <textarea v-model="description" placeholder="Description (Optional)" class="custom-textarea"
                                rows="4" />
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="footer">
                    <ion-button expand="block" class="save-btn" :disabled="!name || !amount" @click="handleSubmit">
                        {{ isEdit ? 'Save' : 'Add Pocket' }}
                    </ion-button>
                </div>

            </div>
        </ion-content>

        <!-- Emoji Picker Sheet -->
        <EmojiPickerSheet :is-open="showEmojiPicker" @close="showEmojiPicker = false" @select="(e) => { emoji = e }" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/vue'
import { useRoute } from 'vue-router'
import { chevronForwardOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import EmojiPickerSheet from '../components/EmojiPickerSheet.vue'

const route = useRoute()

const isEdit = computed(() => route.name === 'Edit Pocket')

const emoji = ref('😊')
const name = ref('')
const amount = ref('')
const displayAmount = ref('')
const description = ref('')
const showEmojiPicker = ref(false)

const staticPockets = [
    { id: 1, emoji: '😊', name: 'Food', balance: 1500000, description: 'Money for food, snack, etc' },
    { id: 2, emoji: '⛽', name: 'Gas', balance: 0, description: 'Oil pocket' },
]

onMounted(() => {
    if (isEdit.value) {
        const id = Number(route.params.id)
        const pocket = staticPockets.find(p => p.id === id)
        if (pocket) {
            emoji.value = pocket.emoji
            name.value = pocket.name
            amount.value = String(pocket.balance)
            displayAmount.value = pocket.balance.toLocaleString('id-ID')
            description.value = pocket.description
        }
    }
})

const handleAmountInput = (e: any) => {
    const raw = e.target.value.replace(/\D/g, '')
    amount.value = raw
    displayAmount.value = raw ? Number(raw).toLocaleString('id-ID') : ''
}

const handleSubmit = () => {
    if (isEdit.value) {
        console.log('Update Pocket', { id: route.params.id, emoji: emoji.value, name: name.value, amount: amount.value, description: description.value })
    } else {
        console.log('Add Pocket', { emoji: emoji.value, name: name.value, amount: amount.value, description: description.value })
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

/* Amount */
.amount-wrapper {
    padding: 0;
    overflow: hidden;
    align-items: stretch;
}

.currency-label {
    padding: 0 12px;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-black-100);
    background: var(--color-bg-3);
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    align-self: stretch;
}

.amount-input {
    --padding-start: 12px;
    --padding-end: 0;
    --padding-top: 12px;
    --padding-bottom: 12px;
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

.emoji-label {
    padding: 0 9.3px;
    font-size: 24px;
    background: var(--color-bg-3);
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    align-self: stretch;
    cursor: pointer;
}
</style>