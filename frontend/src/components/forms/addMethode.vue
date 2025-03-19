<template>
  <v-card
    title="Add New Check Method"
    rounded="xl"
    subtitle="Please provide your method informations"
  >
    <template v-slot:prepend>
      <v-icon size="50">mdi-function-variant</v-icon>
    </template>
    <template v-slot:append>
      <v-btn @click="closeDialog(null)" flat icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card-text>
      <v-divider class="mb-3"></v-divider>
      <v-text-field
        variant="outlined"
        rounded="pill"
        label="Check Method"
        v-model="formData.methodString"
        hint="Please insert a check method."
        class="mb-3"
        :error-messages="validator.methodString.$errors.map((e) => e.$message)"
      />
      <v-select
        :items="resultTypes"
        variant="outlined"
        rounded="pill"
        label="Select Result Type"
        item-title="typeLabel"
        item-value="typeId"
        v-model="formData.resultType"
      />
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
</template>
<script setup>
import { useAppStore } from "@/store/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { onBeforeMount, reactive, ref, watch } from "vue";

const store = useAppStore();
const resultTypes = ref([]);
const alert = store.alert;
const props = defineProps(["closeDialog"]);
const formData = reactive({
  methodString: "",
  resultType: "",
  typeLabel: "",
});

watch(
  () => formData.resultType,
  (data) => {
    const item = resultTypes.value.find((e) => e.typeId == data);
    formData.typeLabel = item.typeLabel;
  }
);
const rules = {
  methodString: {
    required: helpers.withMessage("Check method is required", required),
  },
  resultType: {
    required: helpers.withMessage("Please select a result type", required),
  },
};
const validator = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validator.value.$validate();
    if (!valid) {
      throw {
        title: "Invalid input",
        text: "Please check your input!",
        icon: "error",
        timer: 3000,
      };
    }
    props.closeDialog(formData);
    alert.fire({
      title: "Method Added",
      text: "Method added successfully.",
      icon: "success",
      timer: 3000,
    });
  } catch (error) {
    console.log(error);
    alert.fire(error);
  }
};
const refreshRank = async () => {
  resultTypes.value = await store.ajax({}, "type/resulttype", "post");
};

onBeforeMount(() => {
  refreshRank();
});
</script>
