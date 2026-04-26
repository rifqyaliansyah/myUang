<template>
    <ion-page>
        <ion-content class="login-content" :fullscreen="true">
            <div class="brand-wrapper">
                <span class="brand">MyUang</span>
                <span class="brand-sub">by Me</span>
            </div>
            <div class="login-wrapper">
                <div class="login-header">
                    <h1>Forgot your password?</h1>
                    <p>Please enter your email address and we will send you link to reset your password</p>
                </div>

                <!-- Form -->
                <div class="login-form">
                    <!-- Email -->
                    <div class="form-group">
                        <ion-label>Email</ion-label>
                        <div class="input-wrapper">
                            <ion-input v-model="email" type="email" placeholder="Email" class="custom-input" />
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="login-footer">
                    <ion-button expand="block" class="login-btn" :disabled="!email" @click="handleSendRequest">
                        Send Request
                        <ion-icon :icon="chevronForwardOutline" slot="end" />
                    </ion-button>

                    <p class="signup-text">
                        <ion-button fill="clear" class="signup-btn" router-link="/login">
                            Back to Login
                        </ion-button>
                    </p>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    IonPage,
    IonContent,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
} from '@ionic/vue'
import { chevronForwardOutline } from 'ionicons/icons'

const email = ref('')

const handleSendRequest = () => {
    // handle forgot password logic
    console.log('Send reset password to:', email.value)
}
</script>

<style scoped>
.login-content {
    --background: var(--color-white);
}

.login-wrapper {
    display: flex;
    flex-direction: column;
    min-height: calc(100% - 48px);
    padding: 24px 16px 24px;
    box-sizing: border-box;
}

.brand-wrapper {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 4px;
    padding: 24px 16px 0;
}

.brand {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    line-height: 1.2;
}

.brand-sub {
    font-size: 10px;
    font-weight: 400;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
    line-height: 1.2;
}

/* Header */
.login-header {
    margin-bottom: 32px;
}

.login-header h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin: 0 0 8px;
}

.login-header p {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
    margin: 0;
}

/* Form */
.login-form {
    flex: 1;
}

.form-group {
    margin-bottom: 8px;
}

.form-group ion-label {
    display: block;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin-bottom: 8px;
}

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

/* Footer */
.login-footer {
    padding-top: 16px;
}

.login-btn {
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
    margin-bottom: 16px;
}

.login-btn:not([disabled]) {
    --background: #3077E3;
}

.signup-text {
    text-align: center;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: var(--color-black-80);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
}

.signup-btn {
    color: #3077E3;
    --padding-start: 4px;
    --padding-end: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    margin: 0;
    height: auto;
}
</style>