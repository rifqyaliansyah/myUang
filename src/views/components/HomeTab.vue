<template>
    <ion-page id="home-page">
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Listen now</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content color="light">
            <div class="example-content">Listen now content</div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
</script>

<style scoped>
.example-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>