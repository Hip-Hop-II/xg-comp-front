<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="商户名称">
        <el-input v-model="userStore.userInfo.merchantName" disabled />
      </el-form-item>
      <el-form-item label="转账账户" prop="fromAccount">
        <el-select v-model="drawerProps.row!.fromAccount" @change="accountChange" v-if="drawerProps.title === '发起转账'">
          <el-option
            v-for="item in AccountList"
            :key="item.id"
            :label="AccountTypeMap[item.accountType] + '-' + item.outMerchantNo"
            :value="item"
          />
        </el-select>
        <el-input v-else v-model="AccountTypeMap[drawerProps.row!.fromAccount]" disabled />
      </el-form-item>
      <template v-if="drawerProps.title === '发起转账'">
        <el-form-item label="可用余额">
          <el-input v-model="drawerProps.row!.useMoney" disabled />
        </el-form-item>
        <el-form-item label="冻结余额">
          <el-input v-model="drawerProps.row!.freeze" disabled />
        </el-form-item>
        <el-form-item label="总余额">
          <el-input v-model="drawerProps.row!.total" disabled />
        </el-form-item>
      </template>
      <el-form-item label="入账账户" prop="toMemberId">
        <el-select v-model="drawerProps.row!.toMemberId" clearable :disabled="drawerProps.isView">
          <el-option
            v-for="item in SubMerList"
            :key="item.merchantNum"
            :label="item.merchantName + '-' + userStore.userInfo.merchantNum"
            :value="item.merchantNum"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入账方向" :disabled="drawerProps.isView">
        <el-radio-group v-model="drawerProps.row!.settleType" class="ml-4" :disabled="drawerProps.isView">
          <el-radio value="settle_account" size="large">企业钱包</el-radio>
          <el-radio value="settle_bank" size="large">银行账户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="drawerProps.row!.settleType === 'settle_bank'" label="转账账户" prop="accountId">
        <el-select v-model="drawerProps.row!.accountId" clearable :disabled="drawerProps.isView">
          <el-option
            v-for="item in BankList"
            :key="item.id"
            :label="item.bankName + '-' + item.bankCardNumber"
            :value="item.id"
            @click="bankCardNumber(item.bankCardNumber)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转账金额" prop="settleMoney">
        <el-input-number
          v-model="drawerProps.row!.settleMoney"
          :min="1"
          controls-position="right"
          :disabled="drawerProps.isView"
        />
      </el-form-item>
      <el-form-item label="转账说明" prop="remark">
        <el-input
          v-model="drawerProps.row!.remark"
          :rows="5"
          type="textarea"
          placeholder="请输入原因"
          :disabled="drawerProps.isView"
        />
      </el-form-item>

      <el-row v-if="drawerProps.title === '审核'">
        <el-col :span="24">
          <el-form-item label="审核" prop="approveResult">
            <el-radio-group v-model="drawerProps.row!.approveResult">
              <el-radio :value="1">通过</el-radio>
              <el-radio :value="0">退回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="原因" prop="reason" :required="drawerProps.row.approveResult === 0">
            <el-input v-model="drawerProps.row!.reason" :rows="5" type="textarea" placeholder="请输入原因" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="drawerProps.title !== '查看'" type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { ResultData } from "@/api/interface";
import {
  fundSettlementDetailApi,
  fundSettlementToSubMerBanksApi,
  fundSettlementToSubMerApi,
  merchantAccountFundAccountListApi,
  merchantAccountFundApi
} from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import { ArrayToObject } from "@/utils/index";

const userStore = useUserStore();
const { AccountType } = userStore.dataType;
const AccountTypeMap = ArrayToObject(AccountType, "type", "value");
console.log(1111, userStore.dataType);

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

const rules = reactive({
  fromAccount: [{ required: true, message: "必填" }],
  settleMoney: [{ required: true, message: "必填" }],
  accountId: [{ required: true, message: "必填" }],
  remark: [{ required: true, message: "必填" }],
  approveResult: [{ required: true, message: "必填" }],
  reason: [{ required: true, message: "必填" }],
  riskRule: [{ required: true, message: "必填" }]
});

const getDetail = () => {
  fundSettlementDetailApi({
    id: drawerProps.value.row.id
  }).then((res: ResultData) => {
    drawerProps.value.row = res.data;
    const foundItem = AccountList.value.find(item => item.id === res.data.fromAccountId);
    drawerProps.value.row.fromAccount = foundItem.accountType;
  });
};

const AccountList = ref<any>([]);
const getAccountList = () => {
  merchantAccountFundAccountListApi({}).then((res: ResultData) => {
    AccountList.value = res.data;
  });
};

const BankList = ref<any>([]);
const getBankList = () => {
  fundSettlementToSubMerBanksApi({
    toMerchantNum: userStore.userInfo.merchantNum
  }).then((res: ResultData) => {
    BankList.value = res.data;
  });
};

const SubMerList = ref<any>([]);
const getSubMer = () => {
  fundSettlementToSubMerApi({
    toMerchantNum: userStore.userInfo.merchantNum
  }).then((res: ResultData) => {
    SubMerList.value = res.data;
  });
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  getAccountList();
  getSubMer();
  getBankList();
  if (drawerProps.value.title === "查看" || drawerProps.value.title === "审核") {
    drawerProps.value.isView = true;
    getDetail();
  }
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row
      };
      params.toMerchantNum = userStore.userInfo.merchantNum;
      params.fromAccountId = drawerProps.value.row.fromAccount.id;
      console.log(params);
      const res: ResultData = await drawerProps.value.api!(params);
      console.log(11111, res);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
    }
  });
};

const bankCardNumber = code => {
  drawerProps.value.row.toBankCardId = code;
};

const accountChange = () => {
  merchantAccountFundApi({
    accountType: drawerProps.value.row.fromAccount.accountType,
    accountId: drawerProps.value.row.fromAccount.id
  }).then((res: ResultData) => {
    drawerProps.value.row = { ...drawerProps.value.row, ...res.data[0] };
    drawerProps.value.row.useMoney = drawerProps.value.row.total - drawerProps.value.row.freeze;
  });
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
.radioStyle {
  display: grid;
  .el-radio {
    margin: 10px 0;
    white-space: wrap;
  }
}
</style>
