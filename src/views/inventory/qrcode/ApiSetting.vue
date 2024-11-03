<template>
  <el-card style="max-width: 800px" header="接口设置">
    <el-form
      :model="formData"
      ref="ruleFormRef"
      :rules="rules"
      label-suffix=":"
      :label-width="150"
      size="large"
      label-position="left"
    >
      <el-form-item label="卡商小程序appId" prop="appKey">
        <el-input v-model="formData.appKey" placeholder="请输入卡商小程序appId" />
      </el-form-item>
      <el-form-item label="卡商接口前缀" prop="appUrl">
        <el-input v-model="formData.appUrl" placeholder="请输入卡商接口前缀" />
      </el-form-item>
      <el-form-item label="卡商应用ID" prop="appId">
        <el-input v-model="formData.appId" placeholder="请输入卡商应用ID" />
      </el-form-item>
      <el-form-item label="卡商应用公钥" prop="appPublicKey">
        <el-input
          v-model="formData.appPublicKey"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          placeholder="请输入卡商应用公钥"
        />
      </el-form-item>
      <el-form-item label="平台应用ID" prop="pAppKey">
        <el-input v-model="formData.pAppKey" placeholder="请输入平台应用ID" />
      </el-form-item>
      <el-form-item label="平台公钥" prop="pAppPublicKey">
        <el-input
          v-model="formData.pAppPublicKey"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          placeholder="请输入平台公钥"
        />
      </el-form-item>
      <el-form-item label="平台私钥" prop="pAppSecret">
        <el-input
          v-model="formData.pAppSecret"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 20 }"
          placeholder="请输入平台私钥"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { merchantApiPageListApi, merchantApiUpdateApi } from "@/api/modules/inventory";
import { reactive, onMounted } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/modules/user";

interface FormData {
  id?: string;
  appUrl: string;
  appId: string;
  appKey: string;
  appPublicKey: string;
  pid?: string;
  pAppKey: string;
  pAppSecret: string;
  pAppPublicKey: string;
}

const userStore = useUserStore();
const ruleFormRef = ref<FormInstance>();
const formData = reactive<FormData>({
  appId: "",
  appKey: "",
  appPublicKey: "",
  appUrl: "",
  pAppKey: "",
  pAppPublicKey: "",
  pAppSecret: ""
});

const rules = reactive<FormRules<FormData>>({
  appId: [{ required: true, message: "卡商应用id不能为空", trigger: "blur" }],
  appKey: [{ required: true, message: "卡商小程序appId不能为空", trigger: "blur" }],
  appPublicKey: [{ required: true, message: "卡商应用公钥不能为空", trigger: "blur" }],
  appUrl: [{ required: true, message: "卡商接口前缀不能为空", trigger: "blur" }],
  pAppKey: [{ required: true, message: "平台应用ID不能为空", trigger: "blur" }],
  pAppPublicKey: [{ required: true, message: "平台公钥不能为空", trigger: "blur" }],
  pAppSecret: [{ required: true, message: "平台私钥不能为空", trigger: "blur" }]
});

const submitForm = async () => {
  try {
    await ruleFormRef.value?.validate();
    await merchantApiUpdateApi({
      id: formData.id,
      appId: formData.appId,
      appKey: formData.appKey,
      appPublicKey: formData.appPublicKey,
      appUrl: formData.appUrl.endsWith("/") ? formData.appUrl : formData.appUrl + "/",
      appType: "third",
      merchantNum: userStore.userInfo.merchantNum,
      merchantName: userStore.userInfo.merchantName,
      saasMerchantNum: userStore.userInfo.saasMerchantNum,
      saasMerchantName: userStore.userInfo.saasMerchantName
    });
    await merchantApiUpdateApi({
      id: formData.pid,
      appKey: formData.pAppKey,
      appPublicKey: formData.pAppPublicKey,
      appSecret: formData.pAppSecret,
      appType: "open",
      merchantNum: userStore.userInfo.merchantNum,
      merchantName: userStore.userInfo.merchantName,
      saasMerchantNum: userStore.userInfo.saasMerchantNum,
      saasMerchantName: userStore.userInfo.saasMerchantName
    });
    ElMessage.success("接口信息配置成功");
  } catch (error) {}
};

const resetForm = () => {
  ruleFormRef.value?.resetFields();
};

onMounted(async () => {
  const thirdRes = await merchantApiPageListApi(userStore.userInfo.merchantNum, "third");
  if (thirdRes.data) {
    formData.appId = thirdRes.data[0].appId;
    formData.appKey = thirdRes.data[0].appKey;
    formData.appPublicKey = thirdRes.data[0].appPublicKey;
    formData.appUrl = thirdRes.data[0].appUrl;
    formData.id = thirdRes.data[0].id;
  }
  const openRes = await merchantApiPageListApi(userStore.userInfo.merchantNum, "open");
  if (openRes.data) {
    formData.pAppSecret = openRes.data[0].appSecret;
    formData.pAppKey = openRes.data[0].appKey;
    formData.pAppPublicKey = openRes.data[0].appPublicKey;
    formData.pid = openRes.data[0].id;
  }
});
</script>
