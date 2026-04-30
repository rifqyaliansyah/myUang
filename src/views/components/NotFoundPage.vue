<template>
    <ion-page>
        <ion-content class="page-content" :fullscreen="true">
            <div class="wrapper">
                <div class="code">404</div>
                <div class="title">Page Not Found</div>
                <div class="subtitle">The page you're looking for doesn't exist or has been moved.</div>
                <ion-button class="back-btn" @click="router.replace('/')">
                    Back to Home
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 32px;
    text-align: center;
    gap: 8px;
}

.code {
    font-size: 80px;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: #3077E3;
    margin-bottom: 8px;
}

.title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
}

.subtitle {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
    line-height: 22px;
    max-width: 260px;
}

.back-btn {
    --background: #3077E3;
    --background-activated: var(--color-primary-1);
    --border-radius: 8px;
    --color: var(--color-white);
    --box-shadow: none;
    height: 40px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-top: 16px;
}
</style>