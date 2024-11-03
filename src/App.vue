<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { convertArea, getBrowserLang } from "@/utils";
import { useTheme } from "@/hooks/useTheme";
import { ElConfigProvider } from "element-plus";
import type { LanguageType } from "./stores/interface";
import { useGlobalStore } from "@/stores/modules/global";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { queryLogisticComps, queryProvinceCityAreas, bankListComps, industryTypeComps } from "@/api/modules/enums";
import useEnumsStore from "./stores/modules/enums";

const globalStore = useGlobalStore();
const enumsStore = useEnumsStore();

// init theme
const { initTheme } = useTheme();
initTheme();

// init language
const i18n = useI18n();
onMounted(() => {
  const language = globalStore.language ?? getBrowserLang();
  i18n.locale.value = language;
  globalStore.setGlobalState("language", language as LanguageType);
});

// element language
const locale = computed(() => {
  if (globalStore.language == "zh") return zhCn;
  if (globalStore.language == "en") return en;
  return getBrowserLang() == "zh" ? zhCn : en;
});

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });

onBeforeMount(async () => {
  if (enumsStore.provinceCityCounty.length === 0) {
    const res = await queryProvinceCityAreas();
    enumsStore.setProvinceCityCounty(convertArea(res.data));
  }
  if (enumsStore.logisticComps.length === 0) {
    const res = await queryLogisticComps();
    enumsStore.setLogisticComps(res.data.map(item => ({ label: item.deliveryName, value: item.deliveryCode })));
  }
  if (enumsStore.bankListComps.length === 0) {
    await bankListComps();
  }
  if (enumsStore.industryTypeComps.length === 0) {
    await industryTypeComps();
    // enumsStore.setBankListComps(res.data);
  }
});
</script>
