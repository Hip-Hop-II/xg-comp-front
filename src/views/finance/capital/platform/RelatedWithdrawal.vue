<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格操作 -->
      <template #code="scope">
        <el-button type="primary" link @click="openDrawer('查看', scope.row)">{{ scope.row.orderCode }}</el-button>
      </template>
      <template #action="scope">
        <el-button
          v-if="scope.row.statusCode === 'approve'"
          type="primary"
          link
          :icon="ChatDotSquare"
          @click="openDrawer('审核', scope.row)"
        >
          审核
        </el-button>
      </template>
    </TablePro>

    <AccountWithdrawalDrawer ref="AccountWithdrawalDrawerRef" />
    <RelatedWithdrawalDrawer ref="RelatedWithdrawalDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="RelatedWithdrawal">
import { reactive, ref } from "vue";
import { ChatDotSquare } from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { merchantAccountFundFundWithdrawPageListApi, subMerFundWithdrawApproveApi } from "@/api/modules/finance";
import RelatedWithdrawalDrawer from "./components/RelatedWithdrawalDrawer.vue";
import AccountWithdrawalDrawer from "./components/AccountWithdrawalDrawer.vue";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate, convertFenToYuan } from "@/utils";
import dayjs from "dayjs";

const userStore = useUserStore();
const { SubMerchantStatus } = userStore.dataType;

const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "orderCode", label: "提现编号", search: { el: "input" }, width: 150, isShow: false },
  { prop: "code", label: "提现编号", width: 200 },
  {
    prop: "money",
    label: "提现金额",
    render(scope) {
      return convertFenToYuan(scope.row.money) || "--";
    }
  },
  { prop: "remark", label: "提现说明" },
  { prop: "bankName", label: "银行名称", search: { el: "input" } },
  { prop: "bankCardNumber", label: "银行卡号", width: 180 },
  {
    prop: "startTime",
    label: "发起时间",
    width: 170,
    render(scope) {
      return timestampToDate(scope.row.startTime) || "--";
    }
  },
  {
    prop: "endTime",
    label: "到账完成时间",
    width: 170,
    render(scope) {
      return timestampToDate(scope.row.endTime) || "--";
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
    enum: SubMerchantStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "statusMsg", label: "状态说明" },
  { prop: "action", label: "操作", fixed: "right", width: 120 }
]);

const initParam = reactive({});
const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.platformRole = "subMerchant";
  return merchantAccountFundFundWithdrawPageListApi(newParams);
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

// 打开 drawer(新增、查看、编辑)
const AccountWithdrawalDrawerRef = ref<InstanceType<typeof AccountWithdrawalDrawer> | null>(null);
const RelatedWithdrawalDrawerRef = ref<InstanceType<typeof RelatedWithdrawalDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "审核" ? subMerFundWithdrawApproveApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  if (title === "查看") {
    AccountWithdrawalDrawerRef.value?.acceptParams(params);
  } else {
    RelatedWithdrawalDrawerRef.value?.acceptParams(params);
  }
};
</script>
