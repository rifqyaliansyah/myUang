<template>
    <ion-page>
        <ion-content class="login-content" :fullscreen="true">
            <div class="login-wrapper">
                <!-- Header -->
                <div class="login-header">
                    <img src="/assets/image/check.png" alt="success" class="success-image" />
                    <h1>Great, PIN Successfully Created</h1>
                    <p>Happy managing your finances with MyUang!</p>
                </div>

                <!-- Footer -->
                <div class="login-footer">
                    <ion-button expand="block" class="login-btn" @click="handleGoHome">
                        Okay Let's Go
                        <ion-icon :icon="chevronForwardOutline" slot="end" />
                    </ion-button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
} from '@ionic/vue'
import { chevronForwardOutline } from 'ionicons/icons'

const router = useRouter()

const handleGoHome = () => {
    router.push('/')
}
</script>

<style scoped>
.login-content {
    --background: var(--color-white);
}

.login-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding: 24px 16px 0px 16px;
}

/* Header */
.login-header {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.success-image {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-bottom: 24px;
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

/* Footer */
.login-footer {
    padding-top: 16px;
}

.login-btn {
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
    margin-bottom: 16px;
}
</style>