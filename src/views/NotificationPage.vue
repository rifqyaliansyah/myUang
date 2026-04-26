<template>
    <ion-page>
        <AppHeader title="Notification" :show-back="true" back-href="/home" :show-menu="true"
            menu-trigger-id="notif-menu" :menu-items="[
                { label: 'Mark all read', handler: markAllRead },
                { label: 'Remove all', handler: removeAll, danger: true },
            ]" />

        <ion-content class="page-content" :fullscreen="true">
            <div class="page-wrapper">
                <div class="notif-list">
                    <div class="notif-item">
                        <div class="notif-info">
                            <p class="notif-title">Shopping budget has exceeds the li....</p>
                            <p class="notif-desc">Your Shopping budget has exceeds t....</p>
                        </div>
                        <span class="notif-time">19:30</span>
                    </div>

                    <div class="notif-item">
                        <div class="notif-info">
                            <p class="notif-title">Gaji bulanan telah masuk ke akun ka....</p>
                            <p class="notif-desc">Saldo kamu bertambah IDR 8.000.00....</p>
                        </div>
                        <span class="notif-time">08:00</span>
                    </div>

                    <div class="notif-item">
                        <div class="notif-info">
                            <p class="notif-title">Goals kamu hampir tercapai nihhh....</p>
                            <p class="notif-desc">Tinggal IDR 500.000 lagi untuk menc....</p>
                        </div>
                        <span class="notif-time">07:15</span>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import AppHeader from './components/AppHeader.vue'

const markAllRead = () => {
    console.log('Mark all read')
}

const removeAll = () => {
    console.log('Remove all')
}
</script>

<style scoped>
.page-content {
    --background: var(--color-white);
}

.page-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.notif-list {
    display: flex;
    flex-direction: column;
}

.notif-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 16px;
    position: relative;
}

.notif-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 1px;
    background: var(--color-black-20);
}

.notif-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    overflow: hidden;
}

.notif-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 24px;
    color: var(--color-black-100);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notif-desc {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 24px;
    color: var(--color-black-60);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notif-time {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 24px;
    color: var(--color-black-60);
    white-space: nowrap;
    flex-shrink: 0;
}
</style>