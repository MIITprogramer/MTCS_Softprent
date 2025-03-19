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

    <RankManager
      :close-dialog="
        () => {
          configDialog = false;
        }
      "
      v-if="config == 'rankManager'"
    />
    <TypeManager
      :close-dialog="
        () => {
          configDialog = false;
        }
      "
      v-if="config == 'typeManager'"
    />

    <PointManager
      :close-dialog="
        () => {
          configDialog = false;
        }
      "
      v-if="config == 'pointManager'"
    />
  </v-dialog>
</template>
<script setup>
import { ref } from "vue";
import RoleManager from "../dialogs/roleManager.vue";
import UserManager from "../dialogs/userManager.vue";
import RankManager from "../dialogs/rankManager.vue";
import TypeManager from "../dialogs/typeManager.vue";
import PointManager from "../dialogs/pointManager.vue";

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
  {
    label: "TOOL RANK SETUP",
    subtitle: "Setting up ranks.",
    icon: "mdi-chevron-triple-up",
    key: "rankManager",
  },
  {
    label: "POINT CHECK SETUP",
    subtitle: "Setting up point check.",
    icon: "mdi-checkbox-marked-outline",
    key: "pointManager",
  },
  {
    label: "TOOL TYPE SETUP",
    subtitle: "Setting up tool types.",
    icon: "mdi-wrench-cog",
    key: "typeManager",
  },
];

const configOpen = (key) => {
  config.value = key;
  configDialog.value = true;
};
</script>
