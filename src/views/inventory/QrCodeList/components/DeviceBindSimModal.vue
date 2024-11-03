<template>
  <el-dialog
    v-model="visible"
    title="SIM卡绑定/修改"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="120" size="large">
      <el-form-item label="运营商" prop="telecom">
        <el-select v-model="formData.telecom" placeholder="请选择运营商">
          <el-option v-for="item in Telcom" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="SIM卡手机号" prop="telecomCardTelephone">
        <el-input v-model="formData.telecomCardTelephone" placeholder="请输入SIM卡手机号" :maxlength="11" />
      </el-form-item>
      <el-form-item label="SIM卡ICCID" prop="telecomCardIccid">
        <el-input v-model="formData.telecomCardIccid" placeholder="请输入SIM卡ICCID" :maxlength="20" />
      </el-form-item>
      <el-form-item label="是否实名认证" prop="telecomRealName">
        <el-select v-model="formData.telecomRealName" placeholder="请选择是否实名认证">
          <el-option v-for="item in YesOrNo" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
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
import { merchantDeviceBindSimApi } from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";

interface FormData {
  id: string;
  telecom: string;
  telecomCardTelephone: string;
  telecomCardIccid: string;
  telecomRealName: string;
}

const { Telcom, YesOrNo } = useUserStore().dataType;
const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const formData = reactive<FormData>({
  id: "",
  telecom: "",
  telecomCardTelephone: "",
  telecomCardIccid: "",
  telecomRealName: "0"
});

const rules = reactive<FormRules<FormData>>({
  telecom: [{ required: true, message: "请选择运营商", trigger: "change" }],
  telecomCardTelephone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号输入错误", trigger: "blur" }
  ],
  telecomCardIccid: [{ required: true, message: "请输入ICCID", trigger: "blur" }],
  telecomRealName: [{ required: true, message: "请选择是否实名认证", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await merchantDeviceBindSimApi(formData);
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
  open(data: any) {
    formData.id = data.id;
    formData.telecom = data.telecom;
    formData.telecomCardTelephone = data.telecomCardTelephone;
    formData.telecomCardIccid = data.telecomCardIccid;
    formData.telecomRealName = data.telecomRealName;
    visible.value = true;
  }
});
</script>
