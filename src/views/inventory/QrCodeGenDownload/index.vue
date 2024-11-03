<template>
  <div class="h-full">
    <device-qr
      :key="formData.merchants.length"
      :status-codes="[
        { type: 'export', value: '待导出' },
        { type: 'print', value: '镭雕中' }
      ]"
      default-status-code="export"
      :manufacturer-merchants="formData.merchants"
    >
      <template #default="{ getSearchParams }">
        <el-button type="primary" @click="onExport(getSearchParams())">导出二维码</el-button>
      </template>
    </device-qr>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import DeviceQr from "../components/DeviceQr.vue";
import { manufacturerMerchantsApi, merchantDeviceExportApi } from "@/api/modules/inventory";

const formData = reactive<{
  merchants: Inventory.ManufacturerMerchants[];
}>({
  merchants: []
});

const queryManufacturerMerchants = async () => {
  const res = await manufacturerMerchantsApi();
  formData.merchants = res.data || [];
};

const onExport = async (params: any) => {
  try {
    if (params.classifyCode && params.classifyCode.length) {
      params.classifyCode = params.classifyCode[params.classifyCode.length - 1];
    }
    const res = await merchantDeviceExportApi({
      ...params,
      startPage: false
    });
    window.open(res.data.downloadPath);
    ElMessage.success("导出成功");
  } catch (error) {}
};

onMounted(() => {
  queryManufacturerMerchants();
});
</script>
