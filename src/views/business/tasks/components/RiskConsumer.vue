<template>
  <el-dialog
    v-model="visible"
    title="异常处置"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="60" size="large">
      <el-form-item label="处置" prop="riskRule">
        <el-select v-model="formData.riskRule" placeholder="请选择处置">
          <el-option v-for="item in RiskRuleConsumer" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="riskReason">
        <el-input
          v-model="formData.riskReason"
          type="textarea"
          placeholder="请输入处置原因"
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
import { useUserStore } from "@/stores/modules/user";
import { taskRecordExceptionApi } from "@/api/modules/business";

interface FormData {
  id: string;
  riskRule: string;
  riskReason: string;
}

const { RiskRuleConsumer } = useUserStore().dataType;
const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const formData = reactive<FormData>({
  id: "",
  riskRule: "",
  riskReason: ""
});

const rules = reactive<FormRules<FormData>>({
  riskRule: [{ required: true, message: "请选择处置方式", trigger: "change" }],
  riskReason: [{ required: true, message: "请输入处置原因", trigger: "blur" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await taskRecordExceptionApi(formData);
    visible.value = false;
    emit("success");
  } catch (error) {}
};

const onCancel = () => {
  ruleFormRef.value?.resetFields();
  visible.value = false;
};

const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};

defineExpose({
  open(data: any) {
    formData.id = data.id;
    formData.riskRule = data.riskRule || "";
    formData.riskReason = data.riskReason || "";
    visible.value = true;
  }
});
</script>
