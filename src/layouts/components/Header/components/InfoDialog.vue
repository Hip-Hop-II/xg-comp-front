<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
    <el-descriptions title="">
      <el-descriptions-item label="merchantName">{{ userInfo.merchantName }}</el-descriptions-item>
      <el-descriptions-item label="saasMerchantName">{{ userInfo.saasMerchantName }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();

const userInfo = ref(userStore.userInfo);

const dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
