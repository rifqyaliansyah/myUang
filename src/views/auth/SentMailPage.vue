<template>
    <ion-page>
        <ion-content class="login-content" :fullscreen="true">
            <div class="brand-wrapper">
                <span class="brand">MyUang</span>
                <span class="brand-sub">by Me</span>
            </div>
            <div class="login-wrapper">
                <div class="login-header">
                    <h1>Request Sent Successfully</h1>
                    <p>We already sent you link to reset your password?</p>
                </div>

                <!-- Form (kosong, tanpa input) -->
                <div class="login-form">
                </div>

                <!-- Footer -->
                <div class="login-footer">
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
import {
    IonPage,
    IonContent,
    IonLabel,
    IonButton,
    IonIcon,
} from '@ionic/vue'

// No need for email ref or handleSendRequest anymore
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

/* Footer */
.login-footer {
    padding-top: 16px;
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