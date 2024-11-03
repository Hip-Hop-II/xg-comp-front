<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" title="用户提现审核">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="formData">
      <el-form-item label="审核结果" prop="approveResult">
        <el-select v-model="formData.approveResult">
          <el-option label="拒绝" value="0" />
          <el-option label="通过" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="reason" :required="formData.approveResult === '0'">
        <el-input v-model="formData.reason" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" :maxlength="100" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, toRaw } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { consumerFundWithdrawApproveApi } from "@/api/modules/finance";

interface FormData {
  id: string;
  approveResult: string;
  reason: string;
}

const ruleFormRef = ref<FormInstance>();
const drawerVisible = ref(false);
const formData = reactive<FormData>({
  id: "",
  approveResult: "",
  reason: ""
});
const rules = reactive({
  approveResult: [{ required: true, message: "请选择审核结果", trigger: "blur" }],
  reason: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (formData.approveResult === "0" && value === "") {
          callback(new Error("请填写原因"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

const emit = defineEmits<{
  success: [];
}>();

const open = (id: string) => {
  formData.id = id;
  formData.approveResult = "";
  formData.reason = "";
  drawerVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await consumerFundWithdrawApproveApi(toRaw(formData));
    ElMessage.success("操作成功");
    drawerVisible.value = false;
    emit("success");
  } catch (error) {}
};

defineExpose({
  open
});
</script>
