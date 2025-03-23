<template>
  <div class="w-100 pa-2">
    <v-card title="DAILY CONTROL" subtitle="Daily Inspection Tool Control">
      <template v-slot:append>
        <v-text-field
          v-model="date"
          variant="outlined"
          rounded="pill"
          type="date"
          label="Date"
          hide-details
          density="compact"
          readonly
        />
      </template>
      <v-card-text>
        <v-divider class="mb-3"></v-divider>
        <v-data-table :headers="headers" :items="tools" :search="search">
          <template v-slot:top>
            <v-row>
              <v-col cols="8">
                <h1 class="text-h5">Tool List</h1>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Search tools"
                  variant="outlined"
                  rounded="pill"
                  v-model="search"
                  hide-details
                  density="compact"
                >
                </v-text-field
              ></v-col>
            </v-row>
          </template>
          <template v-slot:item.toolId="{ item }">
            <v-btn-group density="compact" class="w-100">
              <v-btn
                @click="checkTool(item)"
                class="w-50"
                color="primary"
                prepend-icon="mdi-check"
              >
                Check
              </v-btn>
              <v-btn class="w-50" color="success" prepend-icon="mdi-check">
                Not Used
              </v-btn>
            </v-btn-group>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="checkDialog"
      fullscreen
      persistent
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card
        :title="`CHECKING ${selectedTool.toolName.toUpperCase()} - ${selectedTool.registerNumber.toUpperCase()}`"
      >
        <template v-slot:append>
          <v-btn @click="closeCheck" flat icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <v-card-text>
          <DailyCheck
            :tool="selectedTool"
            :close-dialog="closeCheck"
          ></DailyCheck>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import DailyCheck from "@/components/dialogs/checks/dailyCheck.vue";
import { useAppStore } from "@/store/app";
import moment from "moment";
import { nextTick, onBeforeMount, ref } from "vue";

const search = ref("");
const checkDialog = ref(false);
const tools = ref([]);
const store = useAppStore();
const selectedTool = ref(null);

const refresh = async () => {
  tools.value = await store.ajax({}, "tool", "post");
};

const checkTool = (tool) => {
  selectedTool.value = tool;
  nextTick().then(() => {
    checkDialog.value = true;
  });
};

const dd = new Date();
const date = moment(dd).format("YYYY-MM-DD");

const headers = [
  {
    key: "toolName",
    title: "Tool Name",
  },
  {
    key: "registerNumber",
    title: "Register Number",
  },
  {
    key: "toolId",
    title: "Actions",
    align: "center",
    sortable: false,
  },
];
const closeCheck = () => {
  refresh();
  nextTick().finally(() => {
    checkDialog.value = false;
  });
};

onBeforeMount(() => {
  refresh();
});
</script>
