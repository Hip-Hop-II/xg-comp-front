<template>
  <el-dialog
    v-model="visible"
    title="退货地址"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="收件人" prop="receiveUserName">
        <el-input v-model="formData.receiveUserName" placeholder="请输入收件人姓名" />
      </el-form-item>
      <el-form-item label="电话" prop="receiveUserTel">
        <el-input v-model="formData.receiveUserTel" placeholder="请输入收件人电话" :maxlength="11" />
      </el-form-item>
      <el-form-item label="省市区" prop="codes" required>
        <el-cascader
          class="w-full"
          v-model="formData.codes"
          filterable
          :options="enumsStore.provinceCityCounty"
          :props="{ expandTrigger: 'hover' }"
          placeholder="请选择省市区"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="receiveAddress">
        <el-input
          v-model="formData.receiveAddress"
          type="textarea"
          placeholder="精确到门牌号"
          :rows="4"
          :maxlength="100"
          resize="none"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-select v-model="formData.isDefault" placeholder="请选择是否设置为默认">
          <el-option v-for="item in userStore.dataType.YesOrNo" :key="item.value" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="statusCode">
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
import useEnumsStore from "@/stores/modules/enums";
import type { FormInstance, FormRules } from "element-plus";
import { addReturnAddress, updateReturnAddress } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";

const ruleFormRef = ref<FormInstance>();
const enumsStore = useEnumsStore();
const userStore = useUserStore();
const visible = ref(false);
const formData = reactive<BusinessSpace.AfterSaleAddressForm & { codes: string[] }>({
  isDefault: undefined,
  receiveAddress: "",
  receiveArea: "",
  receiveCity: "",
  receiveProvince: "",
  receiveUserName: "",
  receiveUserTel: "",
  codes: [],
  statusCode: ""
});
const rules = reactive<FormRules<typeof formData>>({
  receiveAddress: [{ required: true, message: "详细地址不能为空", trigger: "blur" }],
  receiveUserName: [{ required: true, message: "收件人姓名不能为空", trigger: "blur" }],
  isDefault: [{ required: true, message: "请选择是否设置为默认", trigger: "blur" }],
  receiveUserTel: [
    { required: true, message: "收件人电话不能为空", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "收件人电话输入不正确", trigger: "blur" }
  ],
  statusCode: [{ required: true, message: "请选择状态", trigger: "change" }],
  codes: [{ required: true, message: "请选择省市区", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    const data = toRaw(formData);
    data.receiveProvince = data.codes[0];
    data.receiveCity = data.codes[1];
    data.receiveArea = data.codes[2];
    Reflect.deleteProperty(data, "codes");
    if (formData.id) {
      await updateReturnAddress(data);
    } else {
      await addReturnAddress(data);
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
  open(data?: BusinessSpace.AfterSaleAddressForm) {
    if (data) {
      formData.id = data.id;
      formData.isDefault = data.isDefault;
      formData.receiveAddress = data.receiveAddress;
      formData.receiveArea = data.receiveArea;
      formData.receiveCity = data.receiveCity;
      formData.receiveProvince = data.receiveProvince;
      formData.receiveUserName = data.receiveUserName;
      formData.receiveUserTel = data.receiveUserTel;
      formData.statusCode = data.statusCode;
      formData.codes = [data.receiveProvince, data.receiveCity, data.receiveArea];
    }
    visible.value = true;
  }
});
</script>
