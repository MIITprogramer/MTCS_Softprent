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
      <template v-slot:append>
        <v-list>
          <v-list-item>
            <v-btn
              block
              color="error"
              variant="outlined"
              rounded="pill"
              prepend-icon="mdi-logout"
              @click="logoutDialog = true"
              >Logout</v-btn
            >
          </v-list-item>
        </v-list>
      </template>
      <v-list>
        <v-list-item>
          <v-divider><v-icon>mdi-menu</v-icon> OPTIONS</v-divider>
        </v-list-item>
        <ConfigMenus />
        <v-list-item>
          <v-divider><v-icon>mdi-cogs</v-icon> CONFIGS</v-divider>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
  <v-dialog
    v-model="logoutDialog"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card
      title="You are going to log out"
      rounded="xl"
      subtitle="Please Confirm your actions."
    >
      <template v-slot:prepend>
        <v-icon size="50" color="warning">mdi-help</v-icon>
      </template>
      <v-card-text>
        <v-divider class="mb-3"></v-divider>
        <v-row>
          <v-col cols="6">
            <v-btn
              @click="logoutDialog = false"
              block
              color="primary"
              variant="outlined"
              rounded="pill"
              prepend-icon="mdi-arrow-u-left-bottom"
            >
              cancel
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn
              @click="logout"
              block
              color="error"
              variant="outlined"
              rounded="pill"
              prepend-icon="mdi-logout"
            >
              logout
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import ConfigMenus from "@/components/menus/configMenus.vue";
import router from "@/router";
import { useAppStore } from "@/store/app";
import { nextTick, ref } from "vue";

const settingsDrawer = ref(false);
const logoutDialog = ref(false);
const store = useAppStore();

const logout = async () => {
  store.sessionId = "";
  store.alert.fire({
    text: "Loged Out",
    title: "Loged out successfully",
    icon: "info",
    timer: "2000",
  });
  await nextTick();
  router.push("/login");
};
</script>
