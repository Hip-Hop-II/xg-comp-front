<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #action="scope">
        <el-button type="primary" link @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button v-if="scope.row.statusCode === 'deal'" type="primary" link @click="onSubmit(scope.row)"> 立即提现 </el-button>
        <el-button v-if="scope.row.statusCode === 'deal'" type="primary" link @click="onCancel(scope.row)"> 取消提现 </el-button>
      </template>
    </TablePro>
    <WithdrawalRecordsDrawer ref="WithdrawalRecordsDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="RelatedWithdrawal">
import { reactive, ref } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import {
  subMerchantAccountFundWithdrawCancelApi,
  subMerchantAccountFundWithdrawCommitApi,
  withdrawQueryListApi
} from "@/api/modules/finance";
import WithdrawalRecordsDrawer from "./components/WithdrawalRecordsDrawer.vue";
import { timestampToDate } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
import dayjs from "dayjs";

const userStore = useUserStore();
const { FundOrderStatus } = userStore.dataType;

const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "id", label: "提现编号", search: { el: "input" }, width: 120 },
  { prop: "memberId", label: "会员编号", search: { el: "input" }, width: 120 },
  { prop: "memberName", label: "会员姓名" },
  { prop: "telephone", label: "会员手机号", search: { el: "input" }, isShow: false },
  { prop: "bankCardNumber", label: "银行卡号" },
  {
    prop: "startTime",
    label: "提现发起时间",
    width: 130,
    render(scope) {
      return timestampToDate(scope.row.startTime) || "";
    }
  },
  {
    prop: "startTime",
    label: "审批通过时间",
    width: 130,
    render(scope) {
      return timestampToDate(scope.row.startTime) || "";
    }
  },
  {
    prop: "startTime",
    label: "到账完成时间",
    width: 130,
    render(scope) {
      return timestampToDate(scope.row.startTime) || "";
    }
  },
  {
    prop: "yyyy",
    label: "所属年份",
    search: {
      el: "date-picker",
      props: {
        type: "year",
        "value-format": "YYYY"
      },
      defaultValue: dayjs(Date.now()).format("YYYY")
    },
    isShow: false
  },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: FundOrderStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "statusMsg", label: "状态说明" },
  { prop: "action", label: "操作", fixed: "right", width: 230 }
]);

const initParam = reactive({});

const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify({ ...params, id: userStore.userInfo.merchantNum, platformRole: "subMerchant" }));
  return withdrawQueryListApi(newParams);
};

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
      await subMerchantAccountFundWithdrawCommitApi({ id: data.id });
      ElMessage({
        type: "success",
        message: "提现申请已审核通过"
      });
    })
    .catch(() => {});
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
      await subMerchantAccountFundWithdrawCancelApi({ id: data.id, reason: value, approveResult: 0 });
      ElMessage({
        type: "success",
        message: `您已取消${data.consumerName}的提现`
      });
    })
    .catch(() => {});
};
// 打开 drawer
const WithdrawalRecordsDrawerRef = ref<InstanceType<typeof WithdrawalRecordsDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: undefined,
    getTableList: TableProRef.value?.getTableList
  };
  WithdrawalRecordsDrawerRef.value?.acceptParams(params);
};
</script>
