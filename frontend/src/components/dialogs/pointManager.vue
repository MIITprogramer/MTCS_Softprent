<template>
  <v-data-table :headers="headers" :items="data">
    <template v-slot:item.methodes="{ item }">
      <v-table density="compact" class="text-start ms-0">
        <tbody>
          <tr v-for="(i, index) in item.methodes" :key="i.methodId">
            <td class="w-100 ps-0">{{ i.methodString }} [{{ i.typeLabel }}]</td>
            <td class="text-no-wrap text-end">
              <v-btn
                flat
                icon
                color="transparent"
                @click="openDialog('editMethod', i)"
              >
                <v-icon color="primary">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                color="transparent"
                @click="openDialog('deleteMethod', i)"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </template>
    <template v-slot:item.checkId="{ item }">
      <v-btn
        flat
        icon
        color="transparent"
        @click="openDialog('editOption', item)"
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
  </v-data-table>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <EditMethod :method="selected" :close-dialog="editMethod"></EditMethod>
  </v-dialog>
</template>
<script setup>
import { nextTick, ref } from "vue";
import EditMethod from "../forms/editMethod.vue";
import { useAppStore } from "@/store/app";

const props = defineProps(["type"]);
const data = ref(props.type);
const action = ref(null);
const selected = ref(null);
const dialog = ref(false);
const headers = [
  {
    title: "Point Check",
    key: "pointString",
    align: "start",
  },

  {
    title: "Check Methods",
    key: "methodes",
    align: "start",
    sortable: false,
  },

  {
    title: "Actions",
    key: "checkId",
    align: "center",
    sortable: false,
  },
];
const store = useAppStore();
const alert = store.alert;

const openDialog = (act, item) => {
  action.value = act;
  if (item) {
    selected.value = item;
  }
  dialog.value = true;
};

const editMethod = async (fd) => {
  if (fd) {
    try {
      await store.ajax(fd, "point/editmethod", "post");
      const types = await store.ajax({}, "type", "post");

      const type = types.find((e) => e.typeId == props.type[0].typeId);
      data.value = type.points;

      console.log(data.value);

      alert.fire({
        title: "Method Edited",
        text: "Method edited successfully.",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.log(error);
      alert.fire(error);
      return;
    }
  }
  dialog.value = false;
};
</script>
