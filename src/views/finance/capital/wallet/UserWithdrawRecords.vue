<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="consumerWithdrawQueryListApi"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #action="scope">
        <el-button type="primary" link @click="onSubmit(scope.row)" v-if="scope.row.statusCode === 'deal'"> 立即提现 </el-button>
        <el-button type="primary" link v-if="scope.row.statusCode === 'settle'" @click="onView(scope.row.id)">
          提现结果查询
        </el-button>
        <el-button type="primary" link @click="onCancel(scope.row)" v-if="scope.row.statusCode === 'deal'"> 取消提现 </el-button>
      </template>
    </TablePro>
    <user-withdraw-details ref="userWithdrawDetailsRef" />
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { useUserStore } from "@/stores/modules/user";
import {
  consumerFundWithdrawCancelApi,
  consumerFundWithdrawCommitApi,
  consumerWithdrawQueryListApi
} from "@/api/modules/finance";
import { convertFenToYuan, timestampToDate } from "@/utils";
import { ElOption, ElSelect, ElMessageBox, ElMessage } from "element-plus";
import useEnumsStore from "@/stores/modules/enums";
import UserWithdrawDetails from "./components/UserWithdrawDetails.vue";

const userStore = useUserStore();
const enumStore = useEnumsStore();
const { FundOrderStatus, AccountType } = userStore.dataType;
const userWithdrawDetailsRef = ref<any>();
const options = ref<any>([]);
const initParam = reactive({
  bankNum: "",
  bankName: ""
});
const TableProRef = ref<ProTableInstance>();
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "orderCode", label: "提现单号", search: { el: "input" }, width: 240 },
  {
    prop: "consumerCode",
    label: "用户编号",
    width: 160
  },
  { prop: "consumerName", label: "用户名称", width: 160 },
  { prop: "accountType", label: "出账账户类型", enum: AccountType, fieldNames: { label: "value", value: "type" }, width: 160 },
  { prop: "outMerchantNo", label: "支付公司商户号", width: 240 },
  {
    prop: "bankName",
    label: "到账银行名称",
    search: {
      render() {
        return h(
          ElSelect,
          {
            placeholder: "请选择到账银行名称",
            modelValue: initParam.bankNum,
            "onUpdate:modelValue": val => {
              initParam.bankNum = val;
              initParam.bankName = enumStore.bankListComps.filter(option => option.bankNum === val)[0]?.bankName || "";
            },
            filterable: true,
            remote: true,
            remoteMethod: (query: string) => {
              if (query) {
                options.value = enumStore.bankListComps.filter(option => option.bankName.includes(query));
              } else {
                options.value = [];
              }
            }
          },
          () => options.value.map(option => h(ElOption, { label: option.bankName, value: option.bankNum }))
        );
      }
    },
    width: 160
  },
  { prop: "bankCardNumber", label: "到账银行卡号", width: 180 },
  { prop: "bankAccountName", label: "到账银行卡名称", width: 160 },
  {
    prop: "money",
    label: "提现金额(元)",
    render(scope) {
      return convertFenToYuan(scope.row.money) || "--";
    },
    width: 160
  },
  { prop: "remark", label: "提现说明", width: 160 },
  {
    prop: "startTime",
    label: "发起时间",
    render(scope) {
      return timestampToDate(scope.row.startTime) || "--";
    },
    width: 240
  },
  {
    prop: "endTime",
    label: "完成时间",
    render(scope) {
      return timestampToDate(scope.row.endTime) || "--";
    },
    width: 240
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: FundOrderStatus.filter(item => item.value !== "approve"),
    search: { el: "select" },
    fieldNames: { label: "value", value: "type" },
    width: 150
  },
  { prop: "statusMsg", label: "状态说明", width: 160 },
  { prop: "action", label: "操作", fixed: "right", width: 250 }
]);

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const onSubmit = (data: any) => {
  ElMessageBox.confirm(
    `确定要给<b class="text-red">${data.consumerName}</b>的<b class="text-red">${data.bankName}</b>-<b class="text-red">${data.bankCardNumber}</b>提现吗？`,
    "提现确认",
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(async () => {
      await consumerFundWithdrawCommitApi({ id: data.id });
      ElMessage({
        type: "success",
        message: "提现请求已提交"
      });
    })
    .catch(() => {});
};
const onView = (id: string) => {
  userWithdrawDetailsRef.value?.open(id);
};
const onCancel = (data: any) => {
  ElMessageBox.prompt(`请输入取消<b class="text-red">${data.consumerName}</b>提现原因`, "取消提现", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    dangerouslyUseHTMLString: true,
    inputType: "textarea",
    customClass: "cancel-user-withdraw-box",
    inputValidator: (value: string) => {
      const val = value?.trim();
      if (!val) {
        return "请输入取消提现原因";
      } else if (val.length > 100) {
        return "不能超过100个字符";
      }
      return true;
    }
  })
    .then(async ({ value }) => {
      await consumerFundWithdrawCancelApi({ id: data.id, reason: value, approveResult: 0 });
      ElMessage({
        type: "success",
        message: `您已取消${data.consumerName}的提现`
      });
    })
    .catch(() => {});
};
</script>

<style lang="scss">
.cancel-user-withdraw-box {
  .el-textarea__inner {
    height: 100px;
  }
}
</style>
