<template>
  <el-dialog
    v-model="visible"
    title="设备退回"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="产品数量">{{ formData.amount }}</el-form-item>
      <el-form-item label="退回原因" prop="reason">
        <el-input
          v-model="formData.reason"
          type="textarea"
          placeholder="请输入退回原因"
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
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { merchantDeviceBackApi } from "@/api/modules/inventory";

interface FormData {
  ids: string[];
  amount: number;
  reason: string;
}

const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const formData = reactive<FormData>({
  ids: [],
  amount: 0,
  reason: ""
});

const rules = reactive<FormRules<FormData>>({
  reason: [{ required: true, message: "请输入退回原因", trigger: "blur" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await merchantDeviceBackApi({
      ids: formData.ids,
      reason: formData.reason
    });
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
  open(data: any[]) {
    formData.ids = data.map(item => item.id);
    formData.amount = data.length;
    visible.value = true;
  }
});
</script>
