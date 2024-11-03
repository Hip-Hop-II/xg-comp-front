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
      <el-row v-if="drawerProps.title === '查看'" :gutter="15">
        <el-col :span="24">
          <el-form-item label="关联方编号">
            <el-input v-model="drawerProps.row!.merchantNum" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联方名称">
            <el-input v-model="drawerProps.row!.merchantName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联方类型">
            <el-select v-model="drawerProps.row!.merchantType">
              <el-option v-for="item in MerchantType" :key="item.type" :label="item.value" :value="item.type" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="总金额">
            <el-input v-model="drawerProps.row!.subMerchantRole" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="可用金额">
            <el-input v-model="drawerProps.row!.lawPersonName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="冻结金额">
            <el-input v-model="drawerProps.row!.contractUserName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开户时间">
            <el-input v-model="drawerProps.row!.lawPersonTelephone" />
          </el-form-item>
        </el-col>
      </el-row>

      <div v-if="drawerProps.title === '异常处置'">
        <el-form-item label="处置">
          <el-radio-group v-model="drawerProps.row!.statusCode">
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
        <el-form-item label="原因" class="mt-50px">
          <el-input v-model="drawerProps.row!.statusMsg" :rows="5" type="textarea" placeholder="请输入原因" />
        </el-form-item>
      </div>

      <div v-if="drawerProps.title === '账户设置'">
        <el-form-item label="">
          <el-radio-group v-model="drawerProps.row!.statusMsg">
            <el-radio value="1">提现规则</el-radio>
            <el-radio value="2">转账规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账户留存资金">
          <el-input v-model="drawerProps.row!.accountMinMoney" />
        </el-form-item>
        <el-form-item label="单笔最高提现额">
          <el-input v-model="drawerProps.row!.singleMaxMoney" />
        </el-form-item>
        <el-form-item label="每日提现次数">
          <el-input v-model="drawerProps.row!.dayMaxCount" />
        </el-form-item>
        <el-form-item label="每日提现额度">
          <el-input v-model="drawerProps.row!.dayMaxMoney" />
        </el-form-item>
        <el-form-item label="提现时间">
          <el-time-picker
            v-model="drawerProps.row!.hour"
            is-range
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="提现日期">
          <el-radio-group v-model="drawerProps.row!.operateDay">
            <el-radio v-for="item in FundDay" :key="item.type" :value="item.type"> {{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";
import type { FormInstance } from "element-plus";

import { fundRuleDetailApi } from "@/api/modules/finance";
import type { ResultData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const { MerchantType = [], FundDay } = userStore.dataType;

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const disposalItems = ref({});

const rules = reactive({
  inviteName: [{ required: true, message: "必填" }],
  inviteType: [{ required: true, message: "必填" }],
  roleId: [{ required: true, message: "必填" }],
  roleName: [{ required: true, message: "必填" }],
  telephone: [{ required: true, message: "必填" }],
  inviteValidity: [{ required: true, message: "必填" }],
  inviteUserName: [{ required: true, message: "必填" }]
});
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

const getDetails = async () => {
  // const id = drawerProps.value.row.merchantNum;
  // if (!id) return;
  // const res: ResultData = await relatedPartyAccountsDetailApi({ id });
  // const res2: ResultData = await relatedPartyAccountAttachmentsDetailApi({ id });
  // // TODO：res2 数据要进一部处理
  // drawerProps.value.row = {
  //   ...res.data,
  //   ...res2.data
  // };
};

const getFundRuleDetail = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await fundRuleDetailApi({ memberId: id });
  disposalItems.value = res.data || {};
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.title === "查看") {
    getDetails();
  } else if (drawerProps.value.title === "异常处置") {
  } else if (drawerProps.value.title === "账户设置") {
    getFundRuleDetail();
  }
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row,
        operateStartHour: drawerProps.value.row?.hour[0],
        operateEndHour: drawerProps.value.row?.hour[1]
      };
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

defineExpose({
  acceptParams
});
</script>
