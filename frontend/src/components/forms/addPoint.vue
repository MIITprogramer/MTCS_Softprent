<template>
  <v-card
    title="Add New Point Check"
    rounded="xl"
    subtitle="Please provide your method informations"
  >
    <template v-slot:prepend>
      <v-icon size="50">mdi-checkbox-outline</v-icon>
    </template>
    <template v-slot:append>
      <v-btn flat icon color="transparent" @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card-text>
      <v-text-field
        class="mt-2"
        label="Point Check"
        variant="outlined"
        rounded="pill"
        v-model="formData.pointString"
        :error-messages="validator.pointString.$errors.map((e) => e.$message)"
      />

      <v-divider class="my-3"></v-divider>
      <v-btn
        variant="outlined"
        rounded="pill"
        @click="submit"
        block
        color="primary"
        prepend-icon="mdi-plus"
        >Add</v-btn
      >
    </v-card-text>
  </v-card>
</template>
<script setup>
import { useAppStore } from "@/store/app";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { reactive } from "vue";

const props = defineProps(["typeId", "closeDialog"]);
const store = useAppStore();
const formData = reactive({
  typeId: props.typeId,
  pointString: "",
});
const rules = {
  pointString: {
    req: helpers.withMessage("Point check is required", required),
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
    await store.ajax(formData, "point/addpoint", "post");
    store.alert.fire({
      title: "Point Added",
      text: "Point added successfully!",
      icon: "success",
      timer: 3000,
    });
    props.closeDialog();
  } catch (error) {
    store.alert.fire(error);
  }
};
</script>
