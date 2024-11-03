<template>
  <el-dialog v-model="dialogVisible" title="图片预览">
    <img class="max-w-full" :src="dialogImageUrl" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

defineExpose({
  open(url: string) {
    dialogImageUrl.value = url;
    dialogVisible.value = true;
  }
});
</script>
