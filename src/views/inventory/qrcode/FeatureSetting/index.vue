<template>
  <div class="table-box bg-white p-4 box-border overflow-y-auto">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in tabs" :label="getDataTypeValue('MallType', item.mallType)" :name="item.mallType" :key="item.id">
        <tab-pane :key="item.mallType" :mall-id="item.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { mallConfiguratePageListApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import TabPane from "./TabPane.vue";

const useStore = useUserStore();
const { getDataTypeValue } = useStore;
const activeName = ref("");
const tabs = ref<BusinessSpace.MallConfigurateItem[]>([]);

onMounted(async () => {
  const res = await mallConfiguratePageListApi();
  tabs.value = res.data;
  activeName.value = res.data[0].mallType;
});
</script>
