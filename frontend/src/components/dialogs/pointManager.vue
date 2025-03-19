<template>
  <v-card :title="'POINT CHECK SETUP'" rounded="xl">
    <template v-slot:append>
      <v-btn @click="closeDialog" flat icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card-text>
      <v-data-table
        hover=""
        class="text-uppercase"
        :search="Search"
        :items="points"
        :headers="headers"
      >
        <template v-slot:top>
          <v-row>
            <v-col cols="10">
              <v-text-field
                variant="outlined"
                rounded="pill"
                label="Search points"
                prepend-inner-icon="mdi-magnify"
                hide-details=""
                density="compact"
                v-model="Search"
              />
            </v-col>
            <v-col cols="2">
              <v-btn
                variant="outlined"
                rounded="pill"
                class="fill-height"
                block
                dark
                prepend-icon="mdi-plus"
                @click="openDialog('addPoint', null)"
              >
                ADD Point
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.checkId="{ item }">
          <v-btn
            @click="openDialog('editPoint', item)"
            flat
            icon
            color="transparent"
          >
            <v-icon color="primary">mdi-pencil</v-icon>
          </v-btn>

          <v-btn
            flat
            icon
            color="transparent"
            @click="openDialog('deletePoint', item)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.methodes="{ item }">
          <v-btn
            @click="openDialog('openMethod', item)"
            flat
            icon
            color="transparent"
          >
            <v-icon color="primary">mdi-information-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    max-width="700px"
    transition="dialog-transition"
  >
    <AddPoint
      :close-dialog="closeMyDialog"
      v-if="selectedDialog == 'addPoint'"
    />
    <EditPoint
      :selected-item="selectedItem"
      :close-dialog="closeMyDialog"
      v-if="selectedDialog == 'editPoint'"
    >
    </EditPoint>
    <v-card
      rounded="xl"
      v-if="selectedDialog == 'deletePoint'"
      :title="`You are going to delete ${selectedItem.rankName.toUpperCase()} - ${selectedItem.pointString.toUpperCase()}.`"
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
              @click="closeMyDialog"
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
    <v-card rounded="xl" v-if="selectedDialog == 'openMethod'">
      <template v-slot:title>
        <div class="text-uppercase">
          {{ `${selectedItem.rankName} ${selectedItem.pointString} Methods` }}
        </div>
      </template>
      <template v-slot:append>
        <v-btn @click="closeMyDialog" flat icon color="transparent">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <v-card-text>
        <MethodManager :point="selectedItem"></MethodManager>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app";
import EditPoint from "../forms/editPoint.vue";
import AddPoint from "../forms/addPoint.vue";
import MethodManager from "./methodManager.vue";
const store = useAppStore();
const alert = store.alert;
const dialog = ref(false);
const selectedDialog = ref(null);
const points = ref([]);
const Search = ref("");
const selectedItem = ref(null);
const headers = [
  {
    title: "Point Check",
    key: "pointString",
    align: "start",
  },
  {
    title: "Rank Name",
    key: "rankName",
    align: "start",
  },
  {
    title: "Methodes",
    key: "methodes",
    align: "center",
    sortable: false,
  },
  {
    title: "Actions",
    key: "checkId",
    align: "center",
    sortable: false,
  },
];

defineProps(["closeDialog"]);

const openDialog = (key, item) => {
  selectedItem.value = item;
  selectedDialog.value = key;
  dialog.value = true;
};

const closeMyDialog = () => {
  dialog.value = false;
  refreshPoint();
};

const refreshPoint = async () => {
  points.value = await store.ajax({}, "point", "post");
};

const deletePoint = async () => {
  try {
    await store.ajax(selectedItem.value, "point/deletepoint", "post");
    alert.fire({
      title: "Point deleted",
      text: "Point deleted successfully",
      icon: "success",
      timer: 3000,
    });
    closeMyDialog();
  } catch (error) {
    console.error(error);
    alert.fire(error);
  }
};

onMounted(() => {
  refreshPoint();
});
</script>
