<template>
    <ion-page>
        <AppHeader :title="isEdit ? t('goalsForm.titleEdit') : t('goalsForm.titleAdd')" :show-back="true"
            back-href="/goals" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="form-content">
                    <div class="form-group">
                        <ion-label>{{ t('goalsForm.name') }}</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="name" type="text" :placeholder="t('goalsForm.name')"
                                class="custom-input" />
                        </div>
                    </div>

                    <div class="form-group">
                        <ion-label>{{ t('goalsForm.amount') }}</ion-label>
                        <div class="input-wrapper amount-wrapper">
                            <span class="currency-label">IDR</span>
                            <ion-input v-model="displayAmount" type="text" inputmode="numeric" placeholder="0"
                                class="custom-input amount-input" @ionInput="handleAmountInput" />
                        </div>
                    </div>

                    <div class="form-group">
                        <ion-label>{{ t('goalsForm.description') }}</ion-label>
                        <div class="input-wrapper textarea-wrapper">
                            <textarea v-model="description" :placeholder="t('goalsForm.description')"
                                class="custom-textarea" rows="4" />
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="attachment-wrapper" @click="triggerFilePicker">
                            <ion-icon :icon="imageFile ? closeOutline : documentOutline" class="attachment-icon"
                                :class="{ 'attachment-icon--filled': imageFile }"
                                @click.stop="imageFile ? clearFile() : undefined" />
                            <span class="attachment-label" :class="{ 'attachment-label--filled': imageFile }">
                                {{ imageFile ? imageFile.name : t('goalsForm.attachment') }}
                            </span>
                        </div>
                        <input ref="fileInputRef" type="file" accept="image/jpeg,image/png,image/webp"
                            style="display:none" @change="handleFileChange" />
                    </div>
                </div>

                <div class="footer">
                    <ion-button expand="block" class="save-btn" :disabled="!name || !amount || isSubmitting"
                        @click="handleSubmit">
                        <ion-spinner v-if="isSubmitting" name="crescent" style="width:20px;height:20px;" />
                        <span v-else>{{ isEdit ? t('goalsForm.btnSave') : t('goalsForm.btnAdd') }}</span>
                    </ion-button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IonPage, IonContent, IonLabel, IonInput, IonButton, IonIcon, IonSpinner, toastController } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import { documentOutline, closeOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import { useGoalStore } from '@/stores/goal'

const route = useRoute()
const router = useRouter()
const goalStore = useGoalStore()
const { t } = useI18n()

const isEdit = computed(() => route.name === 'Edit Goals')
const isSubmitting = ref(false)
const name = ref('')
const amount = ref('')
const displayAmount = ref('')
const description = ref('')
const imageFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

onMounted(async () => {
    if (isEdit.value) {
        let goal = goalStore.goals.find(g => g.id === route.params.id)
        if (!goal) {
            await goalStore.fetchGoals()
            goal = goalStore.goals.find(g => g.id === route.params.id)
        }
        if (goal) {
            name.value = goal.name
            amount.value = String(goal.target_amount)
            displayAmount.value = Math.floor(Number(goal.target_amount)).toLocaleString('id-ID')
            description.value = goal.description
        }
    }
})

async function showToast(message: string, color = 'danger') {
    const toast = await toastController.create({ message, duration: 2500, color, position: 'top' })
    await toast.present()
}

const triggerFilePicker = () => { if (!imageFile.value) fileInputRef.value?.click() }
const handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) imageFile.value = file
}
const clearFile = () => {
    imageFile.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''
}
const handleAmountInput = (e: any) => {
    const raw = e.target.value.replace(/\D/g, '')
    amount.value = raw
    displayAmount.value = raw ? Number(raw).toLocaleString('id-ID') : ''
}

const handleSubmit = async () => {
    if (!name.value || !amount.value) return
    isSubmitting.value = true
    try {
        const payload = { name: name.value, target_amount: Number(amount.value), description: description.value, image: imageFile.value }
        if (isEdit.value) {
            await goalStore.updateGoal(route.params.id as string, payload)
            showToast(t('goalsForm.toastUpdated'), 'success')
        } else {
            await goalStore.createGoal(payload)
            showToast(t('goalsForm.toastAdded'), 'success')
        }
        router.back()
    } catch {
        showToast(t('goalsForm.toastFailed'))
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

/* Attachment */
.attachment-wrapper {
    background: var(--color-bg-4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 16px;
    height: 56px;
    box-sizing: border-box;
    border: 1.5px dashed var(--color-black-40);
    border-radius: 8px;
    cursor: pointer;
}

.attachment-icon {
    font-size: 20px;
    color: var(--color-black-60);
}

.attachment-label {
    font-size: 16px;
    font-weight: 400;
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

.attachment-icon--filled {
    color: var(--color-black-100);
}

.attachment-label--filled {
    color: var(--color-black-100);
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}
</style>