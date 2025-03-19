<template>
  <v-card
    title="Add New Point Check"
    rounded="xl"
    subtitle="Please provide your point informations"
  >
    <template v-slot:prepend>
      <v-icon size="50">mdi-checkbox-marked-outline</v-icon>
    </template>
    <template v-slot:append>
      <v-btn @click="closeDialog" flat icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card-text>
      <v-divider class="mb-3"></v-divider>
      <v-text-field
        variant="outlined"
        rounded="pill"
        label="Point Check"
        v-model="formData.pointString"
        hint="Please insert a type name."
        class="mb-3"
        :error-messages="validator.pointString.$errors.map((e) => e.$message)"
      />
      <v-select
        :error-messages="validator.rankId.$errors.map((e) => e.$message)"
        :items="ranks"
        variant="outlined"
        rounded="pill"
        label="Select Rank"
        item-title="rankName"
        item-value="rankId"
        v-model="formData.rankId"
      />
      <v-divider class="mb-3"></v-divider>
      <v-data-table
        class="text-uppercase"
        :headers="methodHeader"
        hide-default-footer
        :items="formData.methodes"
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
          <v-btn @click="removeMethode(item.key)" flat icon color="transparent">
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
        >Add Point chek</v-btn
      >
    </v-card-text>
  </v-card>
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
</template>
<script setup>
import { useAppStore } from "@/store/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { onBeforeMount, reactive, ref } from "vue";
import AddMethode from "./addMethode.vue";
const store = useAppStore();
const ranks = ref([]);
const alert = store.alert;
const props = defineProps(["closeDialog"]);
const formData = reactive({
  pointString: "",
  rankId: "",
  methodes: [],
});
const rules = {
  pointString: {
    required: helpers.withMessage("Point check is required", required),
  },
  rankId: {
    required: helpers.withMessage("Please select a rank", required),
  },
};
const validator = useVuelidate(rules, formData);
const addMethodeDialog = ref(false);
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
const submit = async () => {
  try {
    const valid = await validator.value.$validate();
    const xvalid = valid && formData.methodes.length > 0;
    if (!valid) {
      throw {
        title: "Invalid input",
        text: "Please check your input!",
        icon: "error",
        timer: 3000,
      };
    } else if (!xvalid) {
      throw {
        title: "Empty method",
        text: "Please add at least a method!",
        icon: "error",
        timer: 3000,
      };
    }
    await store.ajax(formData, "point/addpoint", "post");
    alert.fire({
      title: "Point Added",
      text: "Point added successfully.",
      icon: "success",
      timer: 3000,
    });
    props.closeDialog();
  } catch (error) {
    console.log(error);
    alert.fire(error);
  }
};
const refreshRank = async () => {
  ranks.value = await store.ajax({}, "ranks", "post");
};

onBeforeMount(() => {
  refreshRank();
});

const addingMethod = async (item) => {
  try {
    if (item) {
      const d = formData.methodes.find(
        (method) =>
          method.methodString.toLowerCase() ==
            item.methodString.toLowerCase() &&
          item.resultType == method.resultType
      );
      if (d) {
        throw {
          title: "duplicate method",
          text: "Method is already added",
          icon: "error",
          timer: 3000,
        };
      }
      item.key = formData.methodes.length + 1;
      formData.methodes.push(item);
    }
    addMethodeDialog.value = false;
  } catch (error) {
    alert.fire(error);
  }
};

const removeMethode = (id) => {
  formData.methodes = formData.methodes.filter((e) => e.key != id);
};
</script>
