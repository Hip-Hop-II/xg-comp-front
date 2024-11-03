<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" title="用户提现结果">
    <el-form ref="ruleFormRef" label-width="150px" label-suffix=" :" :model="formData" disabled v-if="formData">
      <el-form-item label="提现状态">
        <el-select v-model="formData.statusCode">
          <el-option v-for="item in FundOrderStatus" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="商户名称">
        <el-input v-model="userStore.userInfo.merchantName" />
      </el-form-item>
      <el-form-item label="提现账户">
        <el-input v-model="AccountTypeMap[formData.accountType]" />
      </el-form-item>
      <el-form-item label="到账银行">
        <el-input v-model="formData.bankName" />
      </el-form-item>
      <el-form-item label="银行账号">
        <el-input v-model="formData.bankCardNumber" />
      </el-form-item>
      <el-form-item label="提现金额" prop="money">
        <el-input v-model="formData.money" />
      </el-form-item>
      <el-form-item label="提现说明" prop="remark">
        <el-input v-model="formData.remark" :rows="5" type="textarea" placeholder="请输入原因" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";
import { consumerFundWithdrawResultQueryApi } from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import { ArrayToObject } from "@/utils/index";

const userStore = useUserStore();
const { AccountType, FundOrderStatus } = userStore.dataType;
const AccountTypeMap = ArrayToObject(AccountType, "type", "value");

interface FormData {
  id: string;
  orderCode: string;
  accountType: string;
  bankName: string;
  bankCardNumber: string;
  bankAccountName: string;
  money: string;
  remark: string;
  statusCode: string;
  statusMsg: string;
  startTime: string;
  bankCardId: string;
  accountId: string;
}
const drawerVisible = ref(false);
const formData = ref<FormData>();

const open = async (id: string) => {
  const res = await consumerFundWithdrawResultQueryApi({ id });
  formData.value = res.data as FormData;
  formData.value.money = (Number(formData.value.money) / 100).toFixed(2);
  drawerVisible.value = true;
};

defineExpose({
  open
});
</script>
