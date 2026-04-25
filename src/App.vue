<template>
  <div class="app-shell">
    <ion-app>
      <ion-router-outlet />
    </ion-app>
  </div>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
</script>

<style>
html,
body {
  --ion-background-color: var(--color-white);
  --ion-background-color-rgb: 255, 255, 255;
  background-color: var(--color-white) !important;
  margin: 0;
  padding: 0;
}

.app-shell {
  max-width: 480px;
  margin: 0 auto;
  height: 100vh;
  position: relative;
  box-shadow: 0 0 12px rgba(var(--ion-color-dark-rgb), 0.08);
}

ion-app {
  position: absolute;
  inset: 0;
}

@media (max-width: 480px) {
  .app-shell {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
}

ion-button::part(native) {
  text-transform: none;
  --ripple-color: transparent;
  --background-hover: transparent;
  --background-focused: transparent;
}
</style>