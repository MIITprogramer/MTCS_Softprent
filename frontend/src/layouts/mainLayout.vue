<template>
  <v-app>
    <v-app-bar>
      <template v-slot:append>
        <v-btn flat icon @click="settingsDrawer = true">
          <v-icon>mdi-cogs</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer temporary="" location="right" v-model="settingsDrawer">
      <v-list>
        <v-list-item>
          <v-divider>APP CONFIGS</v-divider>
        </v-list-item>
        <ConfigMenus />
        <v-list-item>
          <v-divider>OPTIONS</v-divider>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import ConfigMenus from "@/components/menus/configMenus.vue";
import { ref } from "vue";

const settingsDrawer = ref(false);
</script>
