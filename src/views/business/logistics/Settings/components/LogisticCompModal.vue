<template>
  <el-dialog
    v-model="visible"
    title="新增物流公司"
    width="500"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="物流公司" prop="deliveryCompanyCode">
        <el-select-v2
          @change="onChange"
          v-model="formData.deliveryCompanyCode"
          :options="options"
          placeholder="搜索物流公司"
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          class="w-full"
        />
      </el-form-item>
      <el-form-item label="设为默认" prop="defaultDeliveryCompany">
        <el-select v-model="formData.defaultDeliveryCompany" placeholder="请选择是否设置为默认">
          <el-option v-for="item in userStore.dataType.YesOrNo" :key="item.value" :label="item.value" :value="item.type" />
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
import type { FormInstance, FormRules } from "element-plus";
import { addLogisticComp } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";

const ruleFormRef = ref<FormInstance>();
const enumsStore = useEnumsStore();
const userStore = useUserStore();
const options = ref([...enumsStore.logisticComps]);
const visible = ref(false);
const loading = ref(false);
const formData = reactive<BusinessSpace.AddLogisticCompForm>({
  defaultDeliveryCompany: undefined,
  deliveryCompanyCode: "",
  deliveryCompanyName: ""
});
const rules = reactive<FormRules<typeof formData>>({
  deliveryCompanyCode: [{ required: true, message: "请选择物流公司", trigger: "blur" }],
  defaultDeliveryCompany: [{ required: true, message: "请选择是否设置为默认", trigger: "blur" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onChange = (value: string) => {
  const item = options.value.find(item => item.value === value);
  formData.deliveryCompanyName = item?.label || "";
};
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await addLogisticComp(formData);
    visible.value = false;
    emit("success");
    ruleFormRef.value?.resetFields();
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};
const remoteMethod = (query: string) => {
  loading.value = true;
  if (query !== "") {
    setTimeout(() => {
      options.value = enumsStore.logisticComps.filter(item => {
        return item.label?.toLowerCase().includes(query.toLowerCase());
      });
    }, 200);
  } else {
    options.value = [];
  }
  loading.value = false;
};
defineExpose({
  open() {
    visible.value = true;
  }
});
</script>
