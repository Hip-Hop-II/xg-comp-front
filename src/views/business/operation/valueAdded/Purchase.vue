<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="!order"
  >
    <el-form label-suffix=":" :label-width="120" v-if="order">
      <el-form-item label="订单编号">{{ order.id }}</el-form-item>
      <el-form-item label="支付金额">{{ (order.price / 100).toFixed(2) }}元</el-form-item>
      <el-form-item label="套餐名称">{{ order.packageName }}</el-form-item>
      <el-form-item label="套餐内容">{{ order.packageDesc }}</el-form-item>
      <el-form-item :label-width="50">
        <el-button type="primary" size="large" @click="onPay">立即支付</el-button>
        <el-button size="large" @click="onCancel">放弃支付</el-button>
      </el-form-item>
    </el-form>
    <el-form :model="formData" size="large" v-else>
      <el-radio-group v-model="formData.packageId">
        <el-form-item v-for="item in packages" :key="item.id" class="w-full">
          <el-radio :value="item.id" class="font-normal w-full" border>
            <span class="mr-4">{{ item.packageName }}</span>
            <span class="mr-4">{{ item.quantity }}份</span>
            <span class="mr-4">有效期：{{ item.validityDay }}天</span>
            <span class="mr-4">
              ¥<b class="text-red text-lg">{{ (item.price / 100).toFixed(2) }}</b>
            </span>
            <span>
              ¥<del>{{ (item.officialPrice / 100).toFixed(2) }}</del>
            </span>
          </el-radio>
        </el-form-item>
      </el-radio-group>
      <el-form-item>
        <span>
          以上{{ title }}服务由
          <b>{{ packages[0]?.companyName }}</b>
          提供服务
        </span>
        <el-button type="primary" style="width: 100%" :disabled="!formData.packageId" @click="onSubmit">立即购买</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  platformPackagePageListApi,
  platformPackagePoAddApi,
  platformPackagePoCancelApi,
  platformPackagePoToPayApi
} from "@/api/modules/business";
import { ElMessage } from "element-plus";

const title = ref("");
const packages = ref<BusinessSpace.PlatformPackage[]>([]);
const order = ref<BusinessSpace.PlatformPackageOrder>();
const visible = ref(false);
const formData = reactive<{ packageId: string; packageType: string }>({
  packageId: "",
  packageType: ""
});

const getReturnUrl = () => {
  let paths = window.location.pathname.split("/");
  paths.pop();
  const paths_str = paths.join("/");
  return `${window.location.origin}${paths_str}/${formData.packageType}-package`;
};

const onSubmit = async () => {
  const res = await platformPackagePoAddApi({ packageId: formData.packageId });
  order.value = res.data;
  title.value = "订单确认";
};

const onPay = async () => {
  const res = await platformPackagePoToPayApi({ id: order.value?.id, returnUrl: getReturnUrl() });
  window.location.href = res.data.payUrl;
};

const onCancel = async () => {
  await platformPackagePoCancelApi({ id: order.value?.id });
  visible.value = false;
  ElMessage.success("已取消支付");
};

defineExpose({
  async open(packageType: string, name: string) {
    formData.packageId = "";
    formData.packageType = packageType;
    order.value = undefined;
    title.value = name;
    const res = await platformPackagePageListApi({ startPage: false, packageType });
    packages.value = res.data || [];
    visible.value = true;
  }
});
</script>
