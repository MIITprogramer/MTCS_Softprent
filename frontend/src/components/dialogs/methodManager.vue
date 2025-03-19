<template>
  <v-data-table
    class="text-uppercase"
    :headers="methodHeader"
    hide-default-footer
    :items="methods"
  >
    <template v-slot:top>
      <div class="text-end w-100">
        <v-btn
          flat
          color="primary"
          variant="outlined"
          rounded="pill"
          prepend-icon="mdi-plus"
          @click="addMethodeDialog = true"
        >
          add method
        </v-btn>
      </div>
    </template>
    <template v-slot:item.key="{ item }">
      <v-btn @click="openEdit(item)" flat icon color="transparent">
        <v-icon color="primary">mdi-pencil</v-icon>
      </v-btn>
      <v-btn @click="deleteMethod(item)" flat icon color="transparent">
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
  <v-dialog
    v-model="addMethodeDialog"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <AddMethode :close-dialog="addingMethod"></AddMethode>
  </v-dialog>
  <v-dialog
    v-model="editMethodeDialog"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <EditMethode :method="selected" :close-dialog="editMethod"></EditMethode>
  </v-dialog>
</template>
<script setup>
import { nextTick, ref } from "vue";
import AddMethode from "../forms/addMethode.vue";
import { useAppStore } from "@/store/app";
import EditMethode from "../forms/editMethode.vue";

let props = defineProps(["point"]);
const methods = ref(props.point.methodes);
const store = useAppStore();
const alert = store.alert;
const selected = ref(null);

const addMethodeDialog = ref(false);
const editMethodeDialog = ref(false);

const methodHeader = [
  {
    title: "Check Method",
    key: "methodString",
    align: "start",
  },
  {
    title: "Result Type",
    key: "typeLabel",
    align: "start",
  },
  {
    title: "Remove",
    key: "key",
    align: "center",
    sortable: false,
  },
];
const openEdit = (method) => {
  selected.value = method;
  console.log(method);
  editMethodeDialog.value = true;
};
const addingMethod = async (fd) => {
  try {
    if (fd) {
      fd.pointCheckId = props.point.checkId;
      let added = await store.ajax(fd, "point/addmethod", "post");
      fd.methodId = added.insertId;
      addMethodeDialog.value = false;
      methods.value.push(fd);
    }

    addMethodeDialog.value = false;
  } catch (error) {
    console.log(error);
    alert.fire(error);
  }
};
const editMethod = async (fd) => {
  try {
    if (fd) {
      await store.ajax(fd, "point/editmethod", "post");

      const index = methods.value.findIndex(
        (item) => item.methodId === fd.methodId
      );
      if (index !== -1) {
        methods.value[index] = { ...methods.value[index], ...fd };
      }
      await nextTick();
      editMethodeDialog.value = false;
    }
    editMethodeDialog.value = false;
  } catch (error) {
    console.log(error);
    alert.fire(error);
  }
};

const deleteMethod = async (item) => {
  try {
    const l = methods.value.length;
    if (l == 1) {
      throw {
        title: "Could not delete",
        text: "A point check is require at least one method",
        icon: "error",
        timer: 3000,
      };
    }

    await store.ajax(item, "point/deletemethod", "post");

    methods.value = methods.value.filter(
      (method) => method.methodId != item.methodId
    );
  } catch (error) {
    console.log(error);
    alert.fire(error);
  }
};
</script>
