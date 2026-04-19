<template>
  <ion-tabs>
    <ion-tab tab="home">
      <HomeTab />
    </ion-tab>
    <ion-tab tab="radio">
      <RadioTab />
    </ion-tab>
    <ion-tab tab="library">
      <LibraryTab />
    </ion-tab>
    <ion-tab tab="search">
      <SearchTab />
    </ion-tab>

    <ion-tab-bar slot="bottom" color="primary">
      <ion-tab-button tab="home">
        <ion-icon :icon="playCircle" />
        Listen Now
      </ion-tab-button>
      <ion-tab-button tab="radio">
        <ion-icon :icon="radio" />
        Radio
      </ion-tab-button>
      <ion-tab-button tab="library">
        <ion-icon :icon="library" />
        Library
      </ion-tab-button>
      <ion-tab-button tab="search">
        <ion-icon :icon="search" />
        Search
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup lang="ts">
import { IonTab, IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/vue'
import { playCircle, radio, library, search } from 'ionicons/icons'

import HomeTab from './components/HomeTab.vue'
import RadioTab from './components/RadioTab.vue'
import LibraryTab from './components/LibraryTab.vue'
import SearchTab from './components/SearchTab.vue'
</script>