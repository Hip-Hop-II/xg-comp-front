<template>
  <el-dialog
    v-model="visible"
    title="设备信息"
    width="600"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="设备编号">{{ formData?.deviceCode }}</el-form-item>
      <el-form-item label="设备名称">{{ formData?.deviceName }}</el-form-item>
      <el-form-item label="会员编号">{{ formData?.bindUserId }}</el-form-item>
      <el-form-item label="会员姓名">{{ formData?.bindUserName }}</el-form-item>
      <el-form-item label="手机号码">{{ formData?.deviceCode }}</el-form-item>
      <el-form-item label="登录名称">{{ formData?.deviceCode }}</el-form-item>
      <el-form-item label="绑定时间">{{ formData?.deviceCode }}</el-form-item>
      <el-form-item label="实名认证">{{ formData?.deviceCode }}</el-form-item>
      <el-form-item label="订单编号">{{ formData?.deviceCode }}</el-form-item>
      <el-form-item label="销售人员">{{ formData?.sellUserName }}</el-form-item>
      <el-form-item label="销售时间">{{ formData?.deviceCode }}</el-form-item>
      <el-form-item label="状态">{{ status.find(s => s.type === formData?.statusCode)?.value }}</el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";

const status = useUserStore().dataType.DeviceStatus;
const visible = ref(false);
const formData = ref<any>();

defineExpose({
  open(data: any) {
    formData.value = data;
    visible.value = true;
  }
});
</script>
