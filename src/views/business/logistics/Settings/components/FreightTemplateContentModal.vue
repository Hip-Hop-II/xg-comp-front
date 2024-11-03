<template>
  <el-dialog v-model="visible" title="运费模版内容" width="600" destroy-on-close :before-close="beforeClose">
    <el-form :model="formData" ref="ruleFormRef" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="省份">
        <el-select v-model="formData.provinceCodes" placeholder="请选择省份" multiple filterable>
          <el-option
            v-for="status in enumsStore.provinceCityCounty"
            :key="status.value"
            :label="status.label"
            :value="status.value as string"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="freight" :rules="[{ required: true, message: '请输入运费', trigger: 'blur' }]">
        <el-input-number style="width: 100%" v-model="formData.freight" :min="0" :max="9999" placeholder="请输入金额" />
      </el-form-item>
      <el-form-item label="状态" prop="statusCode" :rules="{ required: true, message: '请选择状态', trigger: 'blur' }">
        <el-select v-model="formData.statusCode" placeholder="请选择状态">
          <el-option
            v-for="status in userStore.dataType.BaseStatus"
            :key="status.value"
            :label="status.value"
            :value="status.type"
          />
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
import useEnumsStore from "@/stores/modules/enums";
import type { FormInstance } from "element-plus";
import { useUserStore } from "@/stores/modules/user";

const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore();
const enumsStore = useEnumsStore();
const visible = ref(false);
const formData = reactive<Omit<BusinessSpace.FreightTemplateLineItem, "province" | "provinceCode"> & { provinceCodes: string[] }>(
  {
    provinceCodes: [],
    freight: 0,
    statusCode: ""
  }
);
const emit = defineEmits<{
  submit: [data: BusinessSpace.FreightTemplateLineItem];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    visible.value = false;
    emit("submit", {
      templateId: formData.templateId,
      province: formData.provinceCodes.map(c => enumsStore.getProvinceName(c)).join(","),
      provinceCode: formData.provinceCodes.join(","),
      freight: formData.freight,
      statusCode: formData.statusCode
    });
    ruleFormRef.value?.resetFields();
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};

defineExpose({
  open(data?: BusinessSpace.FreightTemplateLineItem) {
    visible.value = true;
    if (data) {
      formData.templateId = data.templateId;
      formData.provinceCodes = data.provinceCode.split(",");
      formData.freight = data.freight;
      formData.statusCode = data.statusCode;
    }
  }
});
</script>
