<template>
  <el-form label-width="150px" label-suffix=" :" :model="rowObj" class="pt-20px card">
    <el-row :gutter="15">
      <el-col :span="8">
        <el-form-item label="二维码ID">{{ rowObj.id }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="代理商编号">{{ rowObj.merchantNum }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="用户编号">{{ rowObj!.memberId }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="绑定设备编号">{{ rowObj!.statusMsg }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="代理商名称">{{ rowObj!.merchantName }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="用户姓名">{{ rowObj!.memberName }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="绑定设备名称">{{ rowObj!.statusMsg }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="销售人员">{{ rowObj!.statusMsg }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="手机号">{{ rowObj!.telephone }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="认证时间">{{ rowObj!.createTimes }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话">{{ rowObj!.telephone }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="身份证号">{{ rowObj!.statusMsg }}</el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="认证结果">{{ rowObj!.statusMsg }}</el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, onMounted } from "vue";
import { realAuthDetailApi } from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import type { ResultData } from "@/api/interface";

const userStore = useUserStore();

const rowObj = ref<any>({});
onMounted(async () => {
  const id = userStore.userInfo.id;
  if (!id) return;
  const res1: ResultData = await realAuthDetailApi({ id });
  rowObj.value = {
    ...res1.data
  };
});
</script>
