<template>
  <div class="h-full">
    <device-qr
      :key="formData.merchants.length"
      :status-codes="[{ type: 'export', value: '待导出' }]"
      default-status-code="export"
      :manufacturer-merchants="formData.merchants"
      show-selection
      ref="deviceQrRef"
    >
      <template #default="{ selectedRows }">
        <el-space>
          <el-button type="primary" @click="onImport">导入设备信息</el-button>
          <el-button type="danger" :disabled="selectedRows.length < 1" @click="onDelete(selectedRows)">批量删除</el-button>
        </el-space>
      </template>
    </device-qr>
    <device-file-import ref="fileRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import DeviceQr from "../components/DeviceQr.vue";
import { manufacturerMerchantsApi, merchantDeviceImportDeleteApi } from "@/api/modules/inventory";
import DeviceFileImport from "./DeviceFileImport.vue";
import { queryProductCategoryList } from "@/api/modules/business";

const fileRef = ref<any>();
const deviceQrRef = ref<any>();
const formData = reactive<{
  merchants: Inventory.ManufacturerMerchants[];
}>({
  merchants: []
});

const queryManufacturerMerchants = async () => {
  const res = await manufacturerMerchantsApi();
  formData.merchants = res.data || [];
};

const onSuccess = () => {
  deviceQrRef.value?.query();
};

const onDelete = (rows: any[]) => {
  ElMessageBox.confirm("确定要删除这些设备码信息吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      merchantDeviceImportDeleteApi({ ids: rows.map(row => ({ id: row.id })) }).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        });
        onSuccess();
        deviceQrRef.value?.clearSelection();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除"
      });
    });
};

const onImport = async () => {
  const categories = await queryProductCategoryList("device");
  fileRef.value?.open({
    categories,
    merchants: formData.merchants
  });
};
onMounted(() => {
  queryManufacturerMerchants();
});
</script>
