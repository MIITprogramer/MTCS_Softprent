<template>
  <v-card
    title="Add New Point Check"
    rounded="xl"
    subtitle="Please provide your point informations"
  >
    <template v-slot:prepend>
      <v-icon size="50">mdi-checkbox-outline</v-icon>
    </template>
    <template v-slot:append>
      <v-btn @click="addPoint(null)" flat icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card-text>
      <v-divider class="mb-3"></v-divider>
      <v-text-field
        variant="outlined"
        rounded="pill"
        label="Point Check Name"
        v-model="formData.pointString"
        hint="Please insert a name."
        class="mb-3"
        :error-messages="validator.pointString.$errors.map((e) => e.$message)"
      />
      <v-data-table
        :headers="methodHeaders"
        :items="formData.checkMethods"
        hide-default-footer
        no-data-text="No point check available"
      >
        <template v-slot:top>
          <v-row>
            <v-col cols="9">
              <v-divider class="mx-5">
                <h1 class="text-h6">CHECK METHOD LIST</h1></v-divider
              >
            </v-col>
            <v-col cols="3">
              <v-btn
                block
                variant="outlined"
                rounded="pill"
                dark
                prepend-icon="mdi-plus"
                density="compact"
                @click="openDialog('addMethod')"
              >
                Method
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.key="{ item }">
          <v-btn
            @click="openDialog('editMethod', item)"
            flat
            icon
            color="transparent"
          >
            <v-icon color="primary">mdi-pencil</v-icon>
          </v-btn>

          <v-btn @click="deleteMethod(item.key)" flat icon color="transparent">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-divider class="mb-3"></v-divider>
      <v-btn
        variant="outlined"
        rounded="pill"
        @click="submit"
        block
        color="primary"
        dark
        >Add</v-btn
      >
    </v-card-text>
  </v-card>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    transition="dialog-transition"
  >
    <AddMethod v-if="action == 'addMethod'" :close-dialog="addMethod" />
    <EditMethod
      v-if="action == 'editMethod'"
      :close-dialog="addMethod"
      :method="selected"
    />
  </v-dialog>
</template>
<script setup>
import { useAppStore } from "@/store/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { nextTick, reactive, ref } from "vue";
import AddMethod from "./addMethod.vue";
import EditMethod from "./editMethod.vue";

const selected = ref(null);
const props = defineProps(["addPoint"]);
const action = ref(null);
const dialog = ref(false);
const store = useAppStore();
const alert = store.alert;
const formData = reactive({
  pointString: "",
  checkMethods: [],
});
const rules = {
  pointString: {
    required: helpers.withMessage("Poin check is required", required),
  },
};

const methodHeaders = [
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
    title: "Actions",
    key: "key",
    align: "center",
    sortable: false,
  },
];

const validator = useVuelidate(rules, formData);

const submit = async () => {
  try {
    const valid = await validator.value.$validate();
    const xvalid = formData.checkMethods.length > 0;
    if (!valid) {
      throw {
        title: "Invalid input",
        text: "Please check your input!",
        icon: "error",
        timer: 3000,
      };
    } else if (!xvalid) {
      throw {
        title: "Empty Check Method",
        text: "A point check needed at least one check method!",
        icon: "error",
        timer: 3000,
      };
    }

    await nextTick();
    props.addPoint(formData);
  } catch (error) {
    console.log(error);
    alert.fire(error);
  }
};
const openDialog = async (key, item) => {
  if (item) {
    selected.value = item;
  }
  action.value = key;
  await nextTick();
  dialog.value = true;
};

const deleteMethod = (key) => {
  formData.checkMethods = formData.checkMethods.filter((m) => m.key != key);
};

const addMethod = async (method) => {
  try {
    if (method) {
      if (!method.key) {
        const l = formData.checkMethods.length;
        method.key = l + 1;

        let isDuplicate = formData.checkMethods.some(
          (m) =>
            m.methodString === method.methodString &&
            m.resultType === method.resultType
        );

        if (isDuplicate) {
          throw {
            title: "Duplicate Method",
            text: "New method is already in the list",
            icon: "error",
            timer: 3000,
          };
        }

        formData.checkMethods.push(method);
        await nextTick();
        dialog.value = false;
        alert.fire({
          title: "Method Added",
          text: "Method added successfully.",
          icon: "success",
          timer: 3000,
        });
      } else {
        selected.value = null;
        console.log(method);
        let isDuplicate = formData.checkMethods.some(
          (m) =>
            m.methodString === method.methodString &&
            m.resultType === method.resultType &&
            m.key != method.key
        );

        if (isDuplicate) {
          throw {
            title: "Duplicate Method",
            text: "New method is already in the list",
            icon: "error",
            timer: 3000,
          };
        }

        const index = formData.checkMethods.findIndex(
          (e) => e.key == method.key
        );
        formData.checkMethods[index] = method;
        await nextTick();
        dialog.value = false;
      }
    } else {
      await nextTick();
      dialog.value = false;
    }
  } catch (error) {
    console.log(error);
    alert.fire(error);
  }
};
</script>
