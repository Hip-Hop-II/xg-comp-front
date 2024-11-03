<template>
  <div class="h-full">
    <device-qr
      :key="formData.merchants.length"
      :status-codes="[
        { type: 'print', value: '镭雕中' },
        { type: 'success', value: '完成' }
      ]"
      default-status-code="print"
      :manufacturer-merchants="formData.merchants"
      show-selection
      @on-search="onSearch"
      ref="deviceQrRef"
    >
      <template #default="{ selectedRows }">
        <el-button
          type="primary"
          v-if="formData.statusCode === 'print'"
          :disabled="selectedRows.length < 1"
          @click="onStocking(selectedRows)"
        >
          二维码入库
        </el-button>
      </template>
    </device-qr>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import DeviceQr from "../components/DeviceQr.vue";
import { manufacturerMerchantsApi, merchantDeviceSuccessApi } from "@/api/modules/inventory";

const deviceQrRef = ref<any>();
const formData = reactive<{
  statusCode: string;
  merchants: Inventory.ManufacturerMerchants[];
}>({
  statusCode: "print",
  merchants: []
});

const queryManufacturerMerchants = async () => {
  const res = await manufacturerMerchantsApi();
  formData.merchants = res.data || [];
};

const onSearch = (params: any) => {
  formData.statusCode = params.statusCode || "print";
};

const onStocking = (rows: any[]) => {
  ElMessageBox.confirm("确定要将这些二维码入库吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      merchantDeviceSuccessApi({ ids: rows.map(row => row.id) }).then(() => {
        ElMessage({
          type: "success",
          message: "二维码入库成功"
        });
        deviceQrRef.value?.query();
        deviceQrRef.value?.clearSelection();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消二维码入库"
      });
    });
};
onMounted(() => {
  queryManufacturerMerchants();
});
</script>
