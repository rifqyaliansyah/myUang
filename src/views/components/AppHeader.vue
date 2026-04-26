<template>
    <ion-header class="ion-no-border">
        <ion-toolbar class="header-toolbar">
            <ion-buttons slot="start">
                <ion-back-button v-if="showBack" :default-href="backHref" class="back-btn" />
            </ion-buttons>
            <ion-title class="header-title">{{ title }}</ion-title>
            <ion-buttons slot="end">
                <ion-button v-if="showMenu" class="more-btn" :id="menuTriggerId">
                    <ion-icon :icon="ellipsisVertical" />
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-popover v-if="showMenu && menuItems.length > 0" :trigger="menuTriggerId" side="bottom" alignment="end"
        trigger-action="click" :dismiss-on-select="true" :show-backdrop="false" :style="popoverStyle"
        class="app-header-popover">
        <ion-content class="popover-content">
            <template v-for="(item, index) in menuItems" :key="index">
                <div class="menu-item" :class="{ 'menu-item--danger': item.danger }" @click="item.handler">
                    <span>{{ item.label }}</span>
                </div>
                <div v-if="index < menuItems.length - 1" class="menu-divider"></div>
            </template>
        </ion-content>
    </ion-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonPopover,
    IonContent,
} from '@ionic/vue'
import { ellipsisVertical } from 'ionicons/icons'

interface MenuItem {
    label: string
    handler: () => void
}

interface MenuItem {
    label: string
    handler: () => void
    danger?: boolean
}

const props = withDefaults(defineProps<{
    title: string
    showBack?: boolean
    backHref?: string
    showMenu?: boolean
    menuItems?: MenuItem[]
    menuTriggerId?: string
}>(), {
    showBack: true,
    backHref: '/home',
    showMenu: false,
    menuItems: () => [],
    menuTriggerId: 'app-header-menu-trigger',
})

const popoverStyle = computed(() => {
    const screenWidth = window.innerWidth
    const appWidth = 480
    const rightMargin = 8

    if (screenWidth <= 768) return ''

    const offset = -(screenWidth - appWidth) / 2 - rightMargin
    return `--offset-x: ${offset}px;`
})
</script>

<style scoped>
.header-toolbar {
    --background: linear-gradient(180deg, #3077E3 0%, var(--color-primary-2) 100%);
    --color: var(--color-white);
    --border-width: 0;
    --padding-start: 4px;
    --padding-end: 4px;
    --min-height: 60px;
}

.header-title {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 32px;
    color: var(--color-white);
    padding: 0 8px;
}

.back-btn {
    --color: var(--color-white);
    --icon-font-size: 24px;
}

.more-btn {
    --color: var(--color-white);
    font-size: 16px;
}

.app-header-popover {
    --width: 160px;
    --border-radius: 16px;
    --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.popover-content {
    --background: var(--color-white);
}

.menu-item {
    padding: 14px 16px;
    font-size: 15px;
    font-weight: 400;
    color: var(--color-black-100);
    cursor: pointer;
    letter-spacing: -0.01em;
    text-align: center;
}

.menu-item--danger:active {
    background: #fff0f0;
}

.menu-item--danger span {
    color: var(--color-red);
}

.menu-divider {
    height: 1px;
    background: var(--color-black-20);
    margin: 0;
}
</style>