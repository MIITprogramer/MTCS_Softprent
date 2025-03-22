<template>
  <div class="ma-2">
    <div class="d-flex w-100 fill-height">
      <div
        ref="scroller"
        :style="`width:1111px!important;height:750px!important;
  overflow-x: auto;
  overflow-y: auto;`"
      >
        <div
          ref="printA"
          class="a3 pa-6"
          :style="{
            transform: `scale(${scale})`,
            fontFamily: selectedFont,
          }"
        >
          <v-row class="pa-0 ma-0">
            <v-col cols="9" class="pa-0 ma-0">
              <div
                class="text-capitalize"
                :style="`font-size:${28}pt!important;margin-bottom:${10}pt`"
              >
                Inspection Tool Control List
                {{ selectedRank.rankName }}
                <br />
                {{ selectedRank.rankNameJp }}計測器管理台帳
              </div>
              <div :style="`font-size:${16}pt!important;margin-bottom:${10}pt`">
                {{ selectedRank.description }}
              </div>
              <div class="" :style="`font-size:${14}pt!important`">
                Date of Issue : {{ issuedD.format("DD/MMM/YYYY") }}
              </div>
            </v-col>
            <v-col cols="3" class="pa-0 ma-0">
              <v-img src="../../assets/image.png"> </v-img>
            </v-col>
          </v-row>

          <div class="mt-2">
            <table
              ref="myTable"
              class="itc_table text-no-wrap"
              :style="`transform-origin: top left; transform: scale(${fontScale})`"
            >
              <thead :style="`font-size:${10}pt!important`">
                <tr>
                  <th>No</th>
                  <th class="borderLeft">Equipment Name <br />機器名称</th>
                  <th class="borderLeft">
                    Regis No.<br />
                    機種固有Ｎo.
                  </th>
                  <th
                    class="borderLeft"
                    v-for="(item, index) in collumns"
                    :key="index"
                    v-show="selectedCol.includes(item.collumnId)"
                  >
                    <div>
                      {{ item.collumnEnString }} <br />
                      <div class="text-no-wrap">
                        {{ item.columnJpString }}
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody :style="`font-size:${10}pt!important`">
                <tr
                  class="borderLeft"
                  v-for="(item, index) in selectedTools"
                  :key="index"
                >
                  <td class="text-center">{{ index + 1 }}</td>
                  <td class="text-no-wrap">{{ item.toolName }}</td>
                  <td class="text-no-wrap">{{ item.registerNumber }}</td>
                  <td
                    class="text-center text-no-wrap"
                    v-for="(itm, i) in collumns"
                    :key="i"
                  >
                    {{ getValue(item, itm) }}
                  </td>
                </tr>

                <tr v-for="(item, index) in empty" :key="index">
                  <td class="text-white"></td>
                  <td class="text-no-wrap text-white">""</td>
                  <td class="text-no-wrap text-white">""</td>
                  <td
                    class="text-center text-white"
                    v-for="(itm, i) in selectedCol"
                    :key="i"
                  >
                    ""
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <v-row>
        <v-col cols="12">
          <v-card class="fill-height">
            <v-card-text>
              <v-text-field
                v-model="issued"
                class="my-5"
                variant="outlined"
                rounded="pill"
                density="compact"
                type="date"
                label="Date if Issue"
                hide-details=""
              />

              <v-slider
                class="w-90"
                v-model="scale"
                step="0.01"
                :max="paper == 'a3' ? 0.99 : 2"
                min="0.50"
                hide-details=""
              >
                <template v-slot:append>
                  <v-btn
                    @click="fitToPage"
                    variant="outlined"
                    rounded="pill"
                    density="compact"
                    prepend-icon="mdi-fit-to-page"
                    color="primary"
                    >fit</v-btn
                  >
                </template>
                <template v-slot:prepend>
                  <v-icon>mdi-magnify</v-icon>
                </template>
              </v-slider>

              <v-slider
                class="w-90"
                v-model="fontScale"
                step="0.001"
                min="0"
                max="2"
                hide-details=""
              >
                <template v-slot:prepend>
                  <v-icon>mdi-format-size</v-icon>
                </template>
              </v-slider>
              <div class="d-flex justify-center w-100">
                <v-btn-group density="compact" class="my-5">
                  <v-btn
                    color="transparent"
                    @click="
                      () => {
                        fontScale = fontScale - 0.001;
                      }
                    "
                  >
                    <v-icon color="error">mdi-format-font-size-decrease</v-icon>
                  </v-btn>
                  <v-btn
                    color="transparent"
                    @click="
                      () => {
                        fontScale = 0.819;
                      }
                    "
                  >
                    <v-icon color="success">mdi-restart</v-icon>
                  </v-btn>
                  <v-btn
                    @click="
                      () => {
                        fontScale = fontScale + 0.001;
                      }
                    "
                    color="transparent"
                  >
                    <v-icon color="primary"
                      >mdi-format-font-size-increase</v-icon
                    >
                  </v-btn>
                </v-btn-group>
              </div>
              <v-select
                hide-details=""
                density="compact"
                variant="outlined"
                rounded="pill"
                :items="fonts"
                v-model="selectedFont"
                label="Select Font"
              ></v-select>

              <v-btn
                class="my-5"
                v-for="item in ranks"
                :key="item.rankId"
                :active="selectedRank == item"
                @click="setRank(item)"
                block
                color="primary"
                variant="outlined"
                rounded="pill"
              >
                {{ item.rankName }}
              </v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-printer"
                block=""
                variant="outlined"
                rounded="pill"
                color="success"
                @click="print"
              >
                Print
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from "@/store/app";
import jsPDF from "jspdf";
import moment from "moment";
import { nextTick, onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import html2canvas from "html2canvas";
import $ from "jquery";

const issuedD = ref(moment(new Date()));
const myTable = ref(null);
const fontScale = ref(0.819);
const paper = ref("a3");
const issued = ref(issuedD.value.format("YYYY-MM-DD"));
const scale = ref(0.5);
const scroller = ref(null);
const tools = ref([]);
const empty = ref([]);
const store = useAppStore();
const ranks = ref([]);
const collumns = ref([]);
const selectedRank = ref({});
const selectedTools = ref([]);
const selectedCol = ref([]);
const printA = ref(null);
const row = ref(32);
const selectedFont = ref("MS PGothic");
const fonts = ref([
  "Arial",
  "Courier New",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Tahoma",
  "Comic Sans MS",
  "MS PGothic",
]);

const papers = reactive({
  a3: { w: 420, h: 297, s: 0.82, sc: 0.65 }, // Perbaiki ukuran A3
  a4: { w: 297, h: 210, s: 0.57, sc: 0.99 }, // Perbaiki ukuran A4
});
const getValue = (item, itm) => {
  const data = item.data.find((e) => e.columId == itm.collumnId);
  if (!data) {
    return "-";
  }
  return data.dataValue;
};
const refreshData = async () => {
  ranks.value = await store.ajax({}, "ranks", "post");
  ranks.value = ranks.value.map((r) => {
    r.rankName = r.rankName.toLowerCase();
    return r;
  });
  tools.value = await store.ajax({}, "tool", "post");
  collumns.value = await store.ajax({}, "tool/getcollumn", "post");
  setRank(ranks.value[0]);
  store.preload = false;
};

watch(issued, (e) => {
  issuedD.value = moment(e);
});
watch(scale, (e) => {
  if (e == 0.65) {
    fitToPage();
  }
});

watch(fontScale, () => {
  const tab = myTable.value;
  const trr = $(tab).find("tbody tr")[0];
  const trH = trr.getBoundingClientRect().height; //
  const trF = 515 / trH;
  console.log(trF);

  const { height } = tab.getBoundingClientRect();

  const pers = trF.toFixed(0) * (515 / height).toFixed(0);
  row.value = pers.toFixed(0);
  const l = row.value - selectedTools.value.length;
  empty.value = Array(l).fill("");
});

const setRank = (rank) => {
  selectedRank.value = rank;
  selectedCol.value = JSON.parse(rank.collumns);
  selectedCol.value = selectedCol.value.map((element) => {
    return Number(element);
  });
  selectedTools.value = tools.value.filter((e) => e.rankId == rank.rankId);

  const l = row.value - selectedTools.value.length;
  empty.value = Array(l).fill("");
};

onBeforeMount(() => {
  refreshData();
});

onMounted(() => {
  fitToPage();

  $(printA.value).css("height", `${papers[paper.value].h}mm`);
  $(printA.value).css("width", `${papers[paper.value].w}mm`);
});

const fitToPage = async () => {
  scale.value = papers[paper.value].sc;
  const container = scroller.value;
  await nextTick();
  if (container && paper.value == "a3") {
    container.scrollLeft =
      container.scrollWidth / 2 - container.clientWidth / 2;
    container.scrollTop =
      container.scrollHeight / 2 - container.clientHeight / 2;
  } else {
    container.scrollLeft =
      container.scrollWidth / 2 - container.clientWidth / 2;
    container.scrollTop = 0;
  }
};
const maxScale = () => {
  scale.value = 1;

  const container = scroller.value;
  if (container) {
    container.scrollLeft = 0;
    container.scrollTop = 0;
  }
};

watch(printA, (e) => {
  console.log(e);
});

watch(paper, async () => {
  if (!printA.value) return;
  // Set ukuran elemen sesuai pilihan kertas
  $(printA.value).css({
    height: `${papers[paper.value].h}mm`,
    width: `${papers[paper.value].w}mm`,
  });
  await nextTick();
  fitToPage();
});

const print = async () => {
  store.preload = true;
  await nextTick();
  maxScale();
  await nextTick();
  html2canvas(printA.value, {
    scale: 3,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg");
    const pdf = new jsPDF({
      // Unit pengukuran: mm, pt, in, px
      orientation: "landscape", // Bisa "portrait" atau "landscape"
      format: paper.value,
      unit: "mm",
    });
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      papers[paper.value].w,
      papers[paper.value].h
    );
    // Simpan sebagai Blob
    const pdfBlob = pdf.output("blob");

    // Buat URL dari Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Buka di tab baru
    window.open(pdfUrl, "_blank");
    fitToPage();
    store.preload = false;
  });
};
</script>

<style scoped>
.a3 {
  background: white;
  border: 1px solid #ccc; /* Opsional */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Opsional */
  margin: auto;
}
.itc_table {
  width: 100% !important;
  border-collapse: collapse; /* Menghilangkan celah antar border */
}

.itc_table th {
  border: 1px solid black; /* Pastikan border seragam */
  padding: 5px;
}

.itc_table td {
  border: 1px solid black; /* Pastikan border seragam */
  padding: 5px;
}

.borderLeft {
  border-left: 1px solid black !important; /* Pastikan border kiri tidak terputus */
}

td.borderLeft {
  border-left: 1px solid black !important; /* Pastikan border kiri tidak terputus */
}
</style>
