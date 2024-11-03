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
      <div v-if="drawerProps.title !== '撤销'">
        <el-form-item label="提现状态" v-if="drawerProps.title === '提现结果'">
          <el-select v-model="drawerProps.row!.statusCode" :disabled="drawerProps.isView">
            <el-option v-for="item in FundOrderStatus" :key="item.type" :label="item.value" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input v-model="userStore.userInfo.merchantName" disabled />
        </el-form-item>
        <el-form-item label="提现账户" prop="account">
          <el-select v-model="drawerProps.row!.account" @change="accountChange" v-if="drawerProps.title === '发起提现'">
            <el-option
              v-for="item in AccountList"
              :key="item.id"
              :label="AccountTypeMap[item.accountType] + '-' + item.outMerchantNo"
              :value="item"
            />
          </el-select>
          <el-input v-else v-model="AccountTypeMap[drawerProps.row!.accountType]" disabled />
        </el-form-item>
        <template v-if="drawerProps.title === '发起提现'">
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
        <el-form-item label="到账银行">
          <el-input v-model="drawerProps.row!.bankName" disabled />
        </el-form-item>
        <el-form-item label="银行账号">
          <el-input v-model="drawerProps.row!.bankCardNumber" disabled />
        </el-form-item>
        <el-form-item label="提现金额" prop="money">
          <el-input-number v-model="drawerProps.row!.money" :min="1" controls-position="right" :disabled="drawerProps.isView" />
        </el-form-item>
        <el-form-item label="提现说明" prop="remark">
          <el-input
            v-model="drawerProps.row!.remark"
            :rows="5"
            type="textarea"
            placeholder="请输入原因"
            :disabled="drawerProps.isView"
          />
        </el-form-item>
      </div>

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
      <el-row v-if="drawerProps.title === '撤销'">
        <el-col :span="24">
          <el-form-item label="原因" prop="reason">
            <el-input v-model="drawerProps.row!.reason" :rows="5" type="textarea" placeholder="请输入原因" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="drawerProps.title !== '查看' && drawerProps.title !== '提现结果'" type="primary" @click="handleSubmit">
        提交
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";

import type { ResultData } from "@/api/interface";
import {
  preFundWithdrawAddApi,
  fundWithdrawDetailApi,
  merchantAccountFundAccountListApi,
  merchantAccountFundApi,
  fundWithdrawResultQueryApi
} from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import { ArrayToObject } from "@/utils/index";

const userStore = useUserStore();
const { AccountType, FundOrderStatus } = userStore.dataType;
const AccountTypeMap = ArrayToObject(AccountType, "type", "value");

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
  money: [{ required: true, message: "必填" }],
  remark: [{ required: true, message: "必填" }],
  approveResult: [{ required: true, message: "必填" }],
  reason: [{ required: true, message: "必填" }],
  account: [{ required: true, message: "必填" }],
  riskRule: [{ required: true, message: "必填" }]
});

const AccountList = ref<any>([]);
const getAccountList = () => {
  merchantAccountFundAccountListApi({}).then((res: ResultData) => {
    AccountList.value = res.data;
  });
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.title === "发起提现") {
    getAccountList();
    preFundWithdrawAddApi({}).then((res: ResultData) => {
      drawerProps.value.row = res.data;
    });
  } else if (drawerProps.value.title === "查看" || drawerProps.value.title === "审核") {
    fundWithdrawDetailApi({
      id: drawerProps.value.row.id
    }).then((res: ResultData) => {
      drawerProps.value.row = res.data;
    });
  } else if (drawerProps.value.title === "提现结果") {
    fundWithdrawResultQueryApi({
      id: drawerProps.value.row.id
    }).then((res: ResultData) => {
      drawerProps.value.row = res.data;
    });
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
      if (drawerProps.value.row.account) {
        params.accountId = drawerProps.value.row.account.id;
      }
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
    }
  });
};

const accountChange = () => {
  merchantAccountFundApi({
    accountType: drawerProps.value.row.account.accountType,
    accountId: drawerProps.value.row.account.id
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
