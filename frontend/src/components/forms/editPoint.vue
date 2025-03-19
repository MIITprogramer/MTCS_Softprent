<template>
  <v-card
    title="Edit Point Check"
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
        :items="ranks"
        variant="outlined"
        rounded="pill"
        label="Select Rank"
        item-title="rankName"
        item-value="rankId"
        v-model="formData.rankId"
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
import { onBeforeMount, reactive, ref } from "vue";

const store = useAppStore();
const ranks = ref([]);
const alert = store.alert;
const props = defineProps(["closeDialog", "selectedItem"]);
const formData = reactive({
  pointString: props.selectedItem.pointString,
  rankId: props.selectedItem.rankId,
  checkId: props.selectedItem.checkId,
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
    await store.ajax(formData, "point/editpoint", "post");
    alert.fire({
      title: "Point Edited",
      text: "Point edited successfully.",
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
</script>
