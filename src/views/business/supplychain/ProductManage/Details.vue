<template>
  <div class="bg-white py-4 rounded-md h-full box-border overflow-y-auto">
    <el-steps :active="active" align-center>
      <el-step title="基础信息" />
      <el-step title="图片参数" />
      <el-step title="规格设置" />
      <el-step title="运营设置" />
    </el-steps>
    <basic-info v-if="active === 0" />
    <image-params v-else-if="active === 1" />
    <specifications v-else-if="active === 2" />
    <operation v-else-if="active === 3" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicInfo from "./components/BasicInfo.vue";
import ImageParams from "./components/ImageParams.vue";
import Specifications from "./components/Specifications.vue";
import Operation from "./components/Operation.vue";

const active = ref(0);
</script>
