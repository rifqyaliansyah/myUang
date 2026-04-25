<template>
    <ion-page>
        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="page-header">
                    <h1>Budgeting</h1>
                    <p>Manage your budget here</p>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px 16px;
}

.page-header h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin: 0 0 8px;
}

.page-header p {
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-80);
    margin: 0;
}
</style>