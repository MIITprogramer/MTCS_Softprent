<template>
  <v-data-table :headers="headers" :items="options">
    <template v-slot:item.pointString="{ item }">
      <div class="text-no-wrap">
        {{ item.pointString }}
      </div>
    </template>
    <template v-slot:item.methods="{ item }">
      <div class="text-no-wrap">
        <v-btn
          @click="openDialog('manageMethods', item)"
          variant="outlined"
          rounded="pill"
          density="compact"
          prepend-icon="mdi-information-outline"
        >
          Check Methods
        </v-btn>
      </div>
    </template>
    <template v-slot:item.checkId="{ item }">
      <v-btn
        flat
        icon
        color="transparent"
        @click="openDialog('editPoint', item)"
      >
        <v-icon color="primary">mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        @click="openDialog('deletePoint', item)"
        flat
        icon
        color="transparent"
      >
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </template>
    <template v-slot:top>
      <v-row>
        <v-col cols="3" offset="9">
          <v-btn
            @click="openDialog('addPoint')"
            prepend-icon="mdi-plus"
            variant="outlined"
            rounded="pill"
            block
            color="primary"
            dark
            >Add Point Check</v-btn
          >
        </v-col>
      </v-row>
    </template>
  </v-data-table>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    :max-width="buttonAction == 'manageMethods' ? '' : '500px'"
    transition="dialog-transition"
  >
    <AddPoint
      :type-id="typeId"
      :closeDialog="closeDialog"
      v-if="buttonAction == 'addPoint'"
    />
    <EditPoint
      v-if="buttonAction == 'editPoint'"
      :point="selectedItem"
      :close-dialog="closeDialog"
    />
    <v-card
      rounded="xl"
      v-if="buttonAction == 'deletePoint'"
      :title="`You are going to delete ${selectedItem.pointString}.`"
      subtitle="Please confirm your action."
    >
      <template v-slot:prepend>
        <v-icon size="50" color="warning">mdi-help</v-icon>
      </template>
      <v-card-text>
        <v-divider class="mb-3"></v-divider>
        <v-row>
          <v-col cols="6">
            <v-btn
              block
              variant="outlined"
              rounded="pill"
              prepend-icon="mdi-arrow-u-left-bottom"
              @click="closeDialog"
              >cancel</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              variant="outlined"
              rounded="pill"
              color="error"
              prepend-icon="mdi-delete"
              @click="deletePoint"
              >Delete</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <MethodManager
      v-if="buttonAction == 'manageMethods'"
      :point-methods="selectedItem"
      :close-dialog="closeDialog"
    />
  </v-dialog>
</template>
<script setup>
import { nextTick, onBeforeMount, ref } from "vue";
import AddPoint from "../forms/addPoint.vue";

import { useAppStore } from "@/store/app";
import EditPoint from "../forms/editPoint.vue";
import MethodManager from "./methodManager.vue";

const props = defineProps(["typeOptions"]);

const buttonAction = ref(null);
const selectedItem = ref(null);
const dialog = ref(false);
const store = useAppStore();
const typeId = props.typeOptions.typeId;
const options = ref([]);
const headers = [
  {
    key: "pointString",
    title: "Point Check",
    align: "start",
  },
  {
    key: "methods",
    title: "Open Methods",
    align: "center",
    sortable: false,
  },
  {
    key: "checkId",
    title: "Actions",
    align: "center",
    sortable: false,
  },
];

const refreshoptions = async () => {
  options.value = await store.ajax({ typeId }, "type/getpoints", "post");
};

const openDialog = async (action, item) => {
  console.log(item);
  if (item != undefined) {
    selectedItem.value = item;
  }
  buttonAction.value = action;
  await nextTick();
  dialog.value = true;
};

const closeDialog = () => {
  refreshoptions();
  dialog.value = false;
};

const deletePoint = async () => {
  await store.ajax(
    { checkId: selectedItem.value.checkId },
    "point/deletePoint",
    "post"
  );
  store.alert.fire({
    title: "Point Deleted",
    text: "Point deleted successfully!",
    icon: "success",
    timer: 3000,
  });
  closeDialog();
};

onBeforeMount(() => {
  refreshoptions();
});
</script>
