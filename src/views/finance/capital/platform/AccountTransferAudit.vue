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
      <template #action="scope">
        <el-button type="primary" link :icon="ChatDotSquare" @click="openDrawer('审核', scope.row)">审核</el-button>
      </template>
    </TablePro>

    <AccountTransferDrawer ref="AccountTransferDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="AccountWithdrawal">
import { reactive, ref } from "vue";
import { ChatDotSquare } from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import AccountTransferDrawer from "./components/AccountTransferDrawer.vue";
import { useUserStore } from "@/stores/modules/user";
import { fundSettlementPageListApi, fundSettlementApproveApi } from "@/api/modules/finance";
import { timestampToDate, convertFenToYuan } from "@/utils";
import dayjs from "dayjs";

const userStore = useUserStore();
const { FundOrderStatus } = userStore.dataType;

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "orderCode", label: "转账编号", search: { el: "input" } },
  {
    prop: "settleMoney",
    label: "转账金额",
    render(scope) {
      return convertFenToYuan(scope.row.settleMoney) || "--";
    }
  },
  { prop: "remark", label: "转账说明" },
  { prop: "fromMemberName", label: "出账方名称" },
  { prop: "toMemberName", label: "入账方名称", search: { el: "input" } },
  {
    prop: "",
    label: "入账方类型",
    search: { el: "select" },
    enum: FundOrderStatus,
    fieldNames: { label: "value", value: "type" },
    width: 100
  },
  { prop: "toBankCardNumber", label: "入账账号" },
  { prop: "", label: "手机号", search: { el: "input" } },
  {
    prop: "startTime",
    label: "发起时间",
    render(scope) {
      return timestampToDate(scope.row.startTime) || "--";
    }
  },
  {
    prop: "endTime",
    label: "完成时间",
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
    search: { el: "select", defaultValue: "approve" },
    enum: FundOrderStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "statusMsg", label: "状态说明", width: 100 },
  { prop: "action", label: "操作", fixed: "right", width: 150 }
]);

const initParam = reactive({});
const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.platformRole = "platform";
  return fundSettlementPageListApi(newParams);
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const AccountTransferDrawerRef = ref<InstanceType<typeof AccountTransferDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "审核",
    row: { ...row },
    api: title === "审核" ? fundSettlementApproveApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  AccountTransferDrawerRef.value?.acceptParams(params);
};
</script>
