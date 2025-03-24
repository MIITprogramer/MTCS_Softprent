<template>
  <div class="d-flex align-center fill-height justify-center" ref="container">
    <div class="pa-2" ref="stepper">
      <v-stepper v-model="step">
        <v-stepper-header fixed>
          <template v-for="(param, index) in parameters" :key="index">
            <v-stepper-item
              :title="param.pointString"
              :value="index + 1"
            ></v-stepper-item>
          </template>
        </v-stepper-header>

        <v-card class="ma-3">
          <v-card-text>
            <v-img :style="`height: ${scale}px;`" :src="dataUrl"></v-img>
          </v-card-text>
        </v-card>
        <v-stepper-window>
          <template v-for="(param, index) in parameters" :key="index">
            <v-stepper-window-item :value="index + 1">
              <v-list>
                <v-list-item
                  v-for="(method, mIndex) in param.methods"
                  :key="mIndex"
                >
                  <v-list-item-title>
                    <v-card>
                      <template v-slot:prepend v-if="param.pointNumber != 0">
                        <div
                          class="text-center"
                          style="
                            border-radius: 50%;
                            border: 1px solid black;
                            width: 40px;
                            height: 40px;
                            font-size: 25px;
                          "
                        >
                          {{ param.pointNumber }}
                        </div>
                      </template>
                      <template v-slot:subtitle>
                        {{ param.pointString }}
                        <span v-if="param.methods.length > 1">
                          [{{ mIndex + 1 }}]
                        </span>
                      </template>
                      <template v-slot:title>
                        <div class="text-wrap">
                          {{ method.methodString }}
                        </div>
                      </template>
                      <template v-slot:append>
                        <v-avatar
                          :color="method.result == 'OK' ? 'success' : 'error'"
                        >
                          <v-icon v-if="method.result == 'OK'" dark
                            >mdi-check</v-icon
                          >
                          <v-icon v-else dark>mdi-close</v-icon>
                        </v-avatar>
                      </template>
                      <v-card-text>
                        <v-card class="w-100">
                          <v-btn-toggle
                            divided=""
                            density="compact"
                            class="w-100"
                            v-if="method.resultType == 1"
                            mandatory
                            v-model="method.value"
                            @update:model-value="
                              setValue($event, method.methodId)
                            "
                          >
                            <v-btn class="w-50" color="success" value="OK"
                              >OK
                            </v-btn>
                            <v-btn class="w-50" color="error" value="NG"
                              >NG
                            </v-btn>
                          </v-btn-toggle>
                        </v-card>
                        <!-- <v-select
                        @update:model-value="
                          setValue($event, method.methodId)
                        "
                        :items="optOKNG"
                        variant="outlined"
                        rounded="pill"
                        v-model="method.value"
                        v-if="method.resultType == 1"
                        :error="!method.value && showError"
                        :error-messages="
                          !method.value && showError
                            ? 'Please input inspection result!'
                            : ''
                        "
                      >
                      </v-select> -->
                        <v-text-field
                          @keyup="setValue($event, method.methodId)"
                          :error="!method.value && showError"
                          :error-messages="
                            !method.value && showError
                              ? 'Please input inspection result!'
                              : ''
                          "
                          hide-spin-buttons=""
                          v-model="method.value"
                          variant="outlined"
                          rounded="pill"
                          type="number"
                          label="Assasement Result"
                          v-if="
                            method.resultType != 1 && method.resultType != 2
                          "
                        >
                        </v-text-field>
                        <v-text-field
                          @keyup="setValue($event, method.methodId)"
                          :error="!method.value && showError"
                          :error-messages="
                            !method.value && showError
                              ? 'Please input inspection result!'
                              : ''
                          "
                          v-model="method.value"
                          variant="outlined"
                          rounded="pill"
                          type="text"
                          label="Assasement Result"
                          v-if="method.resultType == 2"
                        ></v-text-field>
                      </v-card-text>
                    </v-card>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-stepper-window-item>
          </template>
        </v-stepper-window>

        <v-stepper-actions>
          <template v-slot:next>
            <v-btn
              @click="next()"
              color="success"
              append-icon="mdi-arrow-right"
              v-if="step < parameters.length"
              :disabled="!isStepValid() && step >= parameters.length"
            >
              Next
            </v-btn>

            <v-btn
              color="success"
              append-icon="mdi-arrow-right"
              v-if="step == parameters.length"
              :disabled="!isStepValid() && step <= parameters.length"
              @click="finish"
            >
              Finish
            </v-btn>
          </template>

          <template v-slot:prev>
            <v-btn
              @click="
                () => {
                  step--;
                  scaleView();
                }
              "
              color="success"
              prepend-icon="mdi-arrow-left"
              >Back</v-btn
            >
          </template>
        </v-stepper-actions>
      </v-stepper>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeMount, onMounted, ref } from "vue";
import { useAppStore } from "@/store/app";
import $ from "jquery";

const stepper = ref(null);
const scale = ref(1);
const props = defineProps([
  "tool",
  "closeDialog",
  "containerHeight",
  "inspectionDate",
]);
const store = useAppStore();
const step = ref(1);
const parameters = ref([]);
const result = ref([]);
const showError = ref(false); // Untuk menampilkan error jika data kosong
const notGodArr = ref([]);
const container = ref(null);

// Fungsi validasi step saat ini
const isStepValid = () => {
  if (!parameters.value.length) return false;
  const currentStepMethods = parameters.value[step.value - 1]?.methods || [];
  return currentStepMethods.every((method) => method.value);
};

const dataUrl = ref(props.tool.file);

const scaleView = () => {
  nextTick().then(() => {
    setTimeout(() => {
      console.log();
      const stepperHeight = $(stepper.value).outerHeight(true);
      const screenHeight = $(container.value).outerHeight(true); // Ambil tinggi layar
      console.log(stepperHeight, screenHeight);
      if (stepperHeight > screenHeight) {
        const stepperEl = stepper.value;
        scale.value = 300 * 0.8; // Sesuaikan skala berdasarkan tinggi
        console.log(stepperHeight, screenHeight);
        stepperEl.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        scale.value = 300 * 1; // Jika cukup, gunakan ukuran normal
        console.log(stepperHeight, screenHeight);
      }
    }, 200);
  });
};

const next = () => {
  if (isStepValid()) {
    showError.value = false;
    step.value++;
    scaleView();
  } else {
    showError.value = true;
  }
};

// Ambil parameter
const getCheckParameters = () => {
  store
    .ajax(
      {
        toolId: props.tool.toolId,
        sessionId: store.sessionId,
      },
      "tool/dailycheckinit",
      "post"
    )
    .then(async (e) => {
      parameters.value = e.pointChecks;
      e.pointChecks.forEach((item) => {
        item.methods.forEach((element) => {
          element.value = "";
          result.value.push(element);
        });
      });
    });
};

const setValue = (e, methodId) => {
  const typeOf = typeof e;
  if (typeOf == "object") {
    e = e.target.value;
  }

  const index = result.value.findIndex((r) => r.methodId === methodId);
  result.value[index].value = e;

  const standard = JSON.parse(result.value[index].standard);

  const r = store.validateMeasurement(standard.name, e, standard.arg);
  console.log(r);

  if (!r) {
    const exists = notGodArr.value.some(
      (f) => f.methodId === result.value[index].methodId
    );
    if (!exists) {
      notGodArr.value.push(result.value[index]);
    }
  } else {
    const itemIndex = notGodArr.value.findIndex(
      (f) => f.methodId === result.value[index].methodId
    );
    if (itemIndex !== -1) {
      notGodArr.value.splice(itemIndex, 1);
    }
  }

  console.log(notGodArr.value);

  result.value[index].result = r ? "OK" : "NG";
};

const finish = async () => {
  store
    .ajax({ sessionId: store.sessionId }, "auth/getmydata", "post")
    .then((e) => {
      const NG = notGodArr.value.length > 0;
      console.log(notGodArr.value);
      const inspectionData = {
        checkDate: props.inspectionDate,
        judgement: NG ? "NG" : "OK",
        checker: e.userId,
        toolId: props.tool.toolId,
        instData: result.value,
      };

      console.log(inspectionData.instData.length);
      store
        .ajax(inspectionData, "tool/dailychecksubmit", "post")
        .catch((error) => {
          store.alert.fire(error);
        })
        .then(() => {
          props.closeDialog();
        });
    });
};

onMounted(() => {
  getCheckParameters();
  scaleView();
});
</script>
