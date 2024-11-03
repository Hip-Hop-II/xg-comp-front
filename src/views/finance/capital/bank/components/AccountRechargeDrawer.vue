<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <template v-if="drawerProps.title !== '撤销'">
        <div v-if="activeStep === 2">
          <el-form-item label="本次汇款转账码为">
            <div class="color-#e4393c font-size-24px">{{ drawerProps.row!.code }}</div>
          </el-form-item>
          <el-form-item label="注意">
            <div class="color-#e4393c">请在线下转账附言中填写此码</div>
          </el-form-item>
        </div>

        <div v-if="activeStep === 3">
          <div class="color-#e4393c font-size-24px text-align-center mb-10px">
            {{ FundOrderStatusMap[drawerProps.row!.statusCode] || "--" }}
          </div>
          <el-form-item label="原因">
            <div class="color-#e4393c">
              {{ drawerProps.row!.statusMsg || "--" }}
            </div>
          </el-form-item>
        </div>

        <el-form-item label="银行卡" prop="cardId">
          <el-select v-model="drawerProps.row!.cardId" clearable :disabled="activeStep !== 1">
            <el-option
              v-for="item in bankList"
              :key="item.id"
              :label="item.memberName + '/' + item.bankName + '/' + item.bankCardNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="充值金额" prop="money">
          <el-input-number v-model="drawerProps.row!.money" :min="1" controls-position="right" :disabled="activeStep !== 1" />
        </el-form-item>
        <el-form-item label="充值说明" prop="remark">
          <el-input
            v-model="drawerProps.row!.remark"
            :rows="5"
            type="textarea"
            placeholder="请输入原因"
            :disabled="activeStep !== 1"
          />
        </el-form-item>

        <div v-if="activeStep === 1">
          <el-form-item label="注意">
            <div class="color-#e4393c">1.线下汇款金额需与充值金额一致</div>
            <div class="color-#e4393c">2.线下 汇款银行账户名称需与商户名称一致</div>
          </el-form-item>
        </div>

        <div v-if="activeStep === 1 && drawerProps.title !== '充值'">
          <el-form-item label="发起时间"> {{ timestampToDate(drawerProps.row!.startTime) }} </el-form-item>
        </div>
      </template>

      <div v-if="drawerProps.title === '撤销'">
        <el-form-item label="原因" prop="reason">
          <el-input v-model="drawerProps.row!.reason" :rows="5" type="textarea" placeholder="请输入原因" />
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
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

import type { ResultData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import {
  merchantBankFundRechargeCreateApi,
  merchantBankFundRechargeCommitApi,
  merchantBankFundRechargeQueryResultApi,
  getBankAccApi
} from "@/api/modules/finance";
import { ArrayToObject } from "@/utils/index";
import { timestampToDate } from "@/utils";

const userStore = useUserStore();
const { FundOrderStatus } = userStore.dataType;

const FundOrderStatusMap = ArrayToObject(FundOrderStatus, "type", "value");

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
const activeStep = ref(1);

const rules = reactive({
  cardId: [{ required: true, message: "必填" }],
  money: [{ required: true, message: "必填" }],
  remark: [{ required: true, message: "必填" }],
  reason: [{ required: true, message: "必填" }]
});
const getQueryResult = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await merchantBankFundRechargeQueryResultApi({ id });
  drawerProps.value.row = {
    ...drawerProps.value.row,
    ...res.data,
    cardId: res.data.bankCardId
  };
};

const bankList = ref<any>([]);
const getBankAcc = async () => {
  const res: ResultData = await getBankAccApi({});
  bankList.value = res.data;
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.title === "充值") {
    getBankAcc();
    activeStep.value = 1;
  } else if (drawerProps.value.title === "汇款结果") {
    getBankAcc();
    getQueryResult();
    activeStep.value = 3;
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
      if (drawerProps.value.title === "撤销") {
        const res: ResultData = await drawerProps.value.api!(params);
        console.log(11111, res);
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
        return;
      }
      if (activeStep.value === 1) {
        const res: ResultData = await merchantBankFundRechargeCreateApi(params);
        drawerProps.value.row = {
          ...drawerProps.value.row,
          ...res.data,
          time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
        };
        ElMessage.success({ message: `${res.msg}` });
        activeStep.value = 2;
      } else if (activeStep.value === 2) {
        const res: ResultData = await merchantBankFundRechargeCommitApi(params);
        getQueryResult();
        ElMessage.success({ message: `${res.msg}` });
        activeStep.value = 3;
        drawerProps.value.getTableList!();
      } else if (activeStep.value === 3) {
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

<style scoped lang="scss">
.radioStyle {
  display: grid;
  .el-radio {
    margin: 10px 0;
    white-space: wrap;
  }
}
.el-radio-group {
  margin-bottom: 20px;
}
</style>
