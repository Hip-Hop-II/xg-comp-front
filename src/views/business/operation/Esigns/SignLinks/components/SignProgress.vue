<template>
  <el-dialog
    v-model="visible"
    title="签约进度"
    width="800"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :footer="null"
  >
    <div class="mb-3">签约状态：{{ userStore.getDataTypeValue("EleSignStatus", formData?.statusCode) }}</div>
    <div class="mb-3" v-if="formData?.statusMsg?.trim()">状态说明：{{ formData?.statusMsg }}</div>
    <el-table :data="formData?.signUsers" style="width: 100%" border>
      <el-table-column prop="signUserName" label="签约人" />
      <el-table-column prop="statusCode" label="签约状态">
        <template #default="scope">{{ userStore.getDataTypeValue("EleSignStatus", scope.row.statusCode) }}</template>
      </el-table-column>
      <el-table-column prop="statusMsg" label="状态说明">
        <template #default="scope">{{ scope.row.statusMsg.trim() || "-" }}</template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { eleSignTaskProgressApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const visible = ref(false);
const formData = ref<BusinessSpace.SignProgress>();

defineExpose({
  async open(id: string) {
    const res = await eleSignTaskProgressApi({ id });
    formData.value = res.data;
    visible.value = true;
  }
});
</script>
