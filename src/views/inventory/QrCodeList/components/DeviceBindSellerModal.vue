<template>
  <el-dialog
    v-model="visible"
    title="绑定销售人员"
    width="400"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="flex">
      <el-form
        :model="formData"
        ref="ruleFormRef"
        style="width: 100%"
        :rules="rules"
        label-suffix=":"
        :label-width="90"
        size="large"
      >
        <el-form-item label="销售人员" prop="sellUserId">
          <el-select v-model="formData.sellUserId" placeholder="请选择销售人员">
            <el-option v-for="item in sellers" :key="item.merchantNum" :label="item.merchantName" :value="item.merchantNum" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
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
import { merchantDeviceBindSellerApi } from "@/api/modules/inventory";

interface FormData {
  id: string;
  sellUserId: string;
  sellUserName: string;
}

const ruleFormRef = ref<FormInstance>();
const sellers = shallowRef<Inventory.ManufacturerMerchants[]>([]);
const visible = ref(false);
const formData = reactive<FormData>({
  id: "",
  sellUserId: "",
  sellUserName: ""
});

const rules = reactive<FormRules<FormData>>({
  sellUserId: [{ required: true, message: "请选择销售人员", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    formData.sellUserName = sellers.value.find(item => item.merchantNum === formData.sellUserId)?.merchantName || "";
    await merchantDeviceBindSellerApi(formData);
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
  open(data: any, sellerList: Inventory.ManufacturerMerchants[]) {
    formData.id = data.id;
    formData.sellUserId = data.sellUserId;
    formData.sellUserName = data.sellUserName;
    sellers.value = sellerList;
    visible.value = true;
  }
});
</script>
