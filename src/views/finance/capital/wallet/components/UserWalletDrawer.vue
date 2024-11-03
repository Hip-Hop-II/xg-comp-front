<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" :size="'600px'" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
      style="max-width: 95%"
    >
      <div v-if="drawerProps.title === '现金发放'">
        <el-form-item label="用户信息">{{ drawerProps.row!.consumerName }}/{{ drawerProps.row!.consumerCode }}</el-form-item>
        <el-form-item label="发放现金" prop="value">
          <el-input-number style="width: 100%" v-model="drawerProps.row!.value" />
        </el-form-item>
        <el-form-item prop="reason">
          <el-input v-model="drawerProps.row!.reason" :rows="5" type="textarea" placeholder="请输入原因" />
        </el-form-item>
      </div>

      <div v-if="drawerProps.title === '手机验证'">
        <el-form-item label="法人手机">{{ drawerProps.row!.telephone }}</el-form-item>
        <el-form-item label="验证码">
          <el-row type="flex" style="flex-wrap: nowrap">
            <el-input v-model="drawerProps.row!.telCode" placeholder="请输入" />
            <el-button @click="getCode" type="primary" link style="margin-left: 14px">获取验证码</el-button>
          </el-row>
        </el-form-item>
      </div>

      <div v-if="drawerProps.title === '异常处置'">
        <el-form-item label="处置" prop="riskRule">
          <el-radio-group v-model="drawerProps.row!.riskRule">
            <el-radio
              v-for="(value, key) of disposalItems"
              :key="key"
              :value="key"
              class="items-start whitespace-normal mb-10px lh-16px"
            >
              {{ value }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因" class="mt-50px" prop="reason">
          <el-input v-model="drawerProps.row!.reason" :rows="5" type="textarea" placeholder="请输入原因" />
        </el-form-item>
      </div>

      <div v-if="drawerProps.title === '账户设置'">
        <el-form-item label="账户留存资金">
          <el-input v-model="drawerProps.row!.accountMinMoney" />
        </el-form-item>
        <el-form-item label="每日提现次数">
          <el-input v-model="drawerProps.row!.dayMaxCount" />
        </el-form-item>
        <el-form-item label="每日提现额度">
          <el-input v-model="drawerProps.row!.dayMaxMoney" />
        </el-form-item>
      </div>
    </el-form>

    <div v-if="drawerProps.title === '账户汇总'">
      <el-row class="mb-10px pl-30px">现金账户</el-row>
      <el-form-item label="总金额"></el-form-item>
      <el-form-item label="可用金额"></el-form-item>
      <el-form-item label="冻结金额"></el-form-item>
      <el-form-item label="售后中金额"></el-form-item>
      <el-row class="mb-10px pl-30px">积分账户</el-row>
      <el-form-item label="积分总额"></el-form-item>
      <el-form-item label="可用积分"></el-form-item>
      <el-form-item label="冻结积分"></el-form-item>
      <el-form-item label="售后中积分"></el-form-item>
    </div>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="drawerProps.title === '现金发放'" type="primary" @click="consumerAccountSubmit">提交</el-button>
      <el-button v-show="!drawerProps.isView && drawerProps.title !== '现金发放'" type="primary" @click="handleSubmit">
        提交
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";

import {
  fundRuleDetailApi,
  consumerAccountDetailApi,
  consumerAccountRiskRuleApi,
  consumerAccountGrantTelCodeApi,
  consumerAccountReplyTelCodeApi
} from "@/api/modules/finance";
import type { ResultData } from "@/api/interface";

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const disposalItems = ref({});

const rules = reactive({
  value: [{ required: true, message: "必填" }],
  reason: [{ required: true, message: "必填" }],
  riskRule: [{ required: true, message: "必填" }]
});
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

const getDetails = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await consumerAccountDetailApi({ id });
  drawerProps.value.row = {
    ...res.data
  };
  drawerProps.value.row.useMoney = drawerProps.value.row.total - drawerProps.value.row.freeze;
};

const getFundRuleDetail = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await fundRuleDetailApi({ memberId: id });
  disposalItems.value = res.data || {};
};

const getRiskRule = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await consumerAccountRiskRuleApi({ id });
  disposalItems.value = res.data || {};
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.title === "查看") {
    getDetails();
  } else if (drawerProps.value.title === "异常处置") {
    getRiskRule();
  } else if (drawerProps.value.title === "账户设置") {
    getFundRuleDetail();
  }
};
const getCode = async () => {
  const res: ResultData = await consumerAccountReplyTelCodeApi({ id: drawerProps.value.row.id });
  ElMessage.success({ message: `${res.msg}成功！` });
};
const ruleFormRef = ref<FormInstance>();
const consumerAccountSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row
      };
      if (drawerProps.value.title === "现金发放") {
        params.id = drawerProps.value.row.id;
      }
      const res = await drawerProps.value.api!(params);
      drawerProps.value.row.telephone = res.data.telephone;
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.title === "手机验证";
    } catch (error) {
      console.error(error);
    }
  });
};
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row
      };
      if (drawerProps.value.title === "手机验证") {
        params.id = drawerProps.value.row.id;
        await consumerAccountGrantTelCodeApi(params);
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      } else {
        if (drawerProps.value.title === "账户设置") {
          params.operateStartHour = "0000";
          params.operateEndHour = "2359";
          params.singleMaxMoney = 99999999;
        }
        await drawerProps.value.api!(params);
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      }
    } catch (error) {
      console.error(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
