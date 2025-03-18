<template>
  <v-list nav>
    <v-list-item
      v-for="item in configs"
      :key="item.key"
      :title="item.label"
      :subtitle="item.subtitle"
      :active="config == item.key"
      @click="configOpen(item.key)"
    >
      <template v-slot:prepend>
        <v-icon size="30">{{ item.icon }}</v-icon>
      </template>
    </v-list-item>
  </v-list>
  <v-dialog
    v-model="configDialog"
    scrollable
    persistent
    :overlay="false"
    transition="dialog-transition"
  >
    <RoleManager
      :close-dialog="
        () => {
          configDialog = false;
        }
      "
      v-if="config == 'roleManager'"
    />
    <UserManager
      :close-dialog="
        () => {
          configDialog = false;
        }
      "
      v-if="config == 'accountManager'"
    />
  </v-dialog>
</template>
<script setup>
import { ref } from "vue";
import RoleManager from "../dialogs/roleManager.vue";
import UserManager from "../dialogs/userManager.vue";

const configDialog = ref(false);
const config = ref(null);
const configs = [
  {
    label: "ROLE MANAGER",
    subtitle: "Manage roles in the system.",
    icon: "mdi-shield-account",
    key: "roleManager",
  },
  {
    label: "ACCOUNT MANAGER",
    subtitle: "Manage users in the system.",
    icon: "mdi-account-multiple",
    key: "accountManager",
  },
];

const configOpen = (key) => {
  config.value = key;
  configDialog.value = true;
};
</script>
