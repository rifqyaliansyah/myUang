<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>

            <ion-tab-bar slot="bottom">
                <ion-tab-button tab="home" href="/home">
                    <ion-icon :icon="homeOutline" />
                    <ion-label>Home</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="budgeting" href="/budgeting">
                    <ion-icon :icon="compassOutline" />
                    <ion-label>Budgeting</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="goals" href="/goals">
                    <ion-icon :icon="flagOutline" />
                    <ion-label>Goals</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="profile" href="/profile">
                    <ion-icon :icon="personOutline" />
                    <ion-label>Profile</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
} from '@ionic/vue'
import {
    homeOutline,
    compassOutline,
    flagOutline,
    personOutline,
} from 'ionicons/icons'
</script>

<style scoped>
ion-tab-bar {
    --background: var(--color-white);
    --border: 2px solid #f0f0f0;
    height: 92px;
    padding-bottom: env(safe-area-inset-bottom);
}

ion-tab-button {
    --color: var(--color-black-80);
    --color-selected: #3077E3;
    --ripple-color: transparent;
    gap: 4px;
}

ion-tab-button ion-icon {
    font-size: 24px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

ion-tab-button ion-label {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.01em;
    margin-top: 2px;
    padding: 2px 12px;
    border-radius: 20px;
    transition: background 0.2s ease, font-weight 0.2s ease;
}

ion-tab-button.tab-selected ion-icon {
    transform: translateY(-4px);
}

ion-tab-button.tab-selected ion-label {
    font-weight: 700;
    background: var(--color-bg-2);
}
</style>