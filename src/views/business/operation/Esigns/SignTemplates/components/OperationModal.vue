<template>
  <el-dialog
    v-model="visible"
    title="签约模版"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="模版名称" prop="templateName">
        <el-input v-model="formData.templateName" placeholder="请输入模版名称" />
      </el-form-item>
      <el-form-item label="状态" prop="statusCode" v-if="formData.statusCode">
        <el-select v-model="formData.statusCode" placeholder="请选择状态">
          <el-option v-for="item in userStore.dataType.BaseStatus" :key="item.value" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { eleSignTemplateAddApi, eleSignTemplateUpdateApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";

interface FormData {
  id?: string;
  templateName: string;
  statusCode: string;
}

const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore();
const visible = ref(false);
const formData = reactive<FormData>({
  templateName: "",
  statusCode: ""
});
const rules = reactive<FormRules<typeof formData>>({
  templateName: [{ required: true, message: "请输入模版名称", trigger: "blur" }]
});
const emit = defineEmits<{
  success: [];
}>();

const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    if (formData.id) {
      await eleSignTemplateUpdateApi(formData);
    } else {
      const res = await eleSignTemplateAddApi({ templateName: formData.templateName, returnUrl: window.location.href });
      window.location.href = res.data.url;
    }
    visible.value = false;
    ruleFormRef.value?.resetFields();
    emit("success");
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};

defineExpose({
  open(data?: BusinessSpace.SignTemplate) {
    formData.id = data?.id;
    formData.templateName = data?.templateName || "";
    formData.statusCode = data?.statusCode || "";
    visible.value = true;
  }
});
</script>
