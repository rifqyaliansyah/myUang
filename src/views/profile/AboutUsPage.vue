<template>
    <ion-page>
        <AppHeader title="About Us" :show-back="true" back-href="/profile" :show-menu="false" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">

                <div class="about-card">
                    <div class="about-label">App</div>
                    <div class="about-brand">
                        <span class="brand">MyUang</span>
                        <span class="brand-sub">by Me</span>
                    </div>
                    <!-- <div class="about-sub">v1.4.11</div> -->
                    <div class="about-body">
                        MyUang is a personal finance app to help you track income, manage expenses,
                        set budgets with pockets, and achieve your financial goals all in one place.
                    </div>
                </div>

                <div class="divider" />

                <div class="about-card">
                    <div class="about-label">Features</div>
                    <div class="feature-list">
                        <div class="feature-row">
                            <ion-icon :icon="lockClosedOutline" class="feature-icon" />
                            <span>PIN security protection</span>
                        </div>
                        <div class="feature-row">
                            <ion-icon :icon="walletOutline" class="feature-icon" />
                            <span>Multi-wallet management</span>
                        </div>
                        <div class="feature-row">
                            <ion-icon :icon="trendingUpOutline" class="feature-icon" />
                            <span>Income & expense tracking</span>
                        </div>
                        <div class="feature-row">
                            <ion-icon :icon="layersOutline" class="feature-icon" />
                            <span>Budget pockets</span>
                        </div>
                        <div class="feature-row">
                            <ion-icon :icon="flagOutline" class="feature-icon" />
                            <span>Financial goals</span>
                        </div>
                        <div class="feature-row">
                            <ion-icon :icon="notificationsOutline" class="feature-icon" />
                            <span>Smart notifications</span>
                        </div>
                    </div>
                </div>

                <div class="divider" />

                <!-- <div class="about-card">
                    <div class="about-label">Developer</div>
                    <div class="about-body">Made with ❤️ for better financial habits.</div>
                </div> -->

                <div class="divider" />

                <div class="about-card">
                    <div class="about-version">v1.7.15</div>
                    <div class="about-footer">© {{ currentYear }} MyUang. All rights reserved.</div>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import AppHeader from '../components/AppHeader.vue'
import {
    walletOutline, trendingUpOutline, layersOutline,
    flagOutline, notificationsOutline, lockClosedOutline
} from 'ionicons/icons'

const currentYear = new Date().getFullYear()
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
    padding: 16px;
}

.about-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
}

.about-label {
    font-size: 13px;
    font-weight: 600;
    color: #3077E3;
    letter-spacing: -0.01em;
}

.about-brand {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 4px;
}

.about-version {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
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
    color: var(--color-black-40);
    letter-spacing: -0.01em;
    line-height: 1.2;
}

.about-sub {
    font-size: 13px;
    font-weight: 400;
    color: var(--color-black-60);
    letter-spacing: -0.01em;
}

.about-body {
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-80);
    letter-spacing: -0.02em;
    line-height: 24px;
}

.about-footer {
    font-size: 13px;
    font-weight: 400;
    color: var(--color-black-40);
    letter-spacing: -0.01em;
}

.divider {
    height: 1px;
    background: var(--color-black-20);
}

.feature-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.feature-row {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-80);
    letter-spacing: -0.02em;
    line-height: 24px;
}

.feature-icon {
    font-size: 20px;
    color: #3077E3;
    flex-shrink: 0;
}
</style>