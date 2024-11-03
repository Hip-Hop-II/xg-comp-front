<template>
  <el-dialog
    v-model="visible"
    title="设备信息"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="设备编号" prop="deviceCode">
        <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备型号" prop="deviceModel">
        <el-input v-model="formData.deviceModel" placeholder="请输入设备型号" />
      </el-form-item>
      <el-form-item label="设备品牌" prop="deviceBrand">
        <el-input v-model="formData.deviceBrand" placeholder="请输入设备品牌" />
      </el-form-item>
      <el-form-item label="生产商" prop="manufacturerMerchantNum">
        <el-select v-model="formData.manufacturerMerchantNum" placeholder="请选择生产商">
          <el-option v-for="item in merchants" :key="item.merchantNum" :label="item.merchantName" :value="item.merchantNum" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="statusCode">
        <el-select v-model="formData.statusCode" placeholder="请选择状态">
          <el-option v-for="item in statusCodes" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="变更说明" prop="statusMsg">
        <el-input
          v-model="formData.statusMsg"
          type="textarea"
          placeholder="请输入变更说明"
          :rows="4"
          :maxlength="100"
          resize="none"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, shallowRef } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { merchantDeviceImportUpdateApi } from "@/api/modules/inventory";

const ruleFormRef = ref<FormInstance>();
const merchants = shallowRef<Inventory.ManufacturerMerchants[]>([]);
const statusCodes = shallowRef<{ type: string; value: string }[]>([]);
const visible = ref(false);
const formData = reactive<Inventory.DeviceCodeListItemForm>({
  id: "",
  deviceCode: "",
  deviceName: "",
  deviceModel: "",
  deviceBrand: "",
  manufacturerMerchantNum: "",
  statusCode: "",
  statusMsg: ""
});

const rules = reactive<FormRules<Inventory.DeviceCodeListItemForm>>({
  manufacturerMerchantNum: [{ required: true, message: "请选择生产商", trigger: "change" }],
  statusCode: [{ required: true, message: "请选择状态", trigger: "change" }],
  statusMsg: [{ required: true, message: "请输入变更说明", trigger: "blur" }],
  deviceCode: [{ required: true, message: "请输入设备编号", trigger: "blur" }],
  deviceName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
  deviceModel: [{ required: true, message: "请输入设备型号", trigger: "blur" }],
  deviceBrand: [{ required: true, message: "请输入设备品牌", trigger: "blur" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await merchantDeviceImportUpdateApi(formData);
    visible.value = false;
    ruleFormRef.value?.resetFields();
    emit("success");
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};
const onCancel = () => {
  ruleFormRef.value?.resetFields();
  visible.value = false;
};
defineExpose({
  open(
    data: Inventory.DeviceCodeListItem,
    merchantsData: Inventory.ManufacturerMerchants[],
    statusCodesData: { type: string; value: string }[]
  ) {
    formData.id = data.id;
    formData.deviceCode = data.deviceCode;
    formData.deviceName = data.deviceName;
    formData.deviceModel = data.deviceModel;
    formData.deviceBrand = data.deviceBrand;
    formData.manufacturerMerchantNum = data.manufacturerMerchantNum;
    formData.statusCode = data.statusCode;
    formData.statusMsg = data.statusMsg;
    merchants.value = merchantsData;
    statusCodes.value = statusCodesData;
    visible.value = true;
  }
});
</script>
