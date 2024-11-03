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
        <el-button type="primary" link @click="openDrawer('查看', scope.row)">{{ scope.row.bizId }}</el-button>
      </template>
    </TablePro>

    <AccountWithdrawalDrawer ref="AccountWithdrawalDrawerRef" />
    <AccountTransferDrawer ref="AccountTransferDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="RelatedWithdrawal">
import { reactive, ref } from "vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { consumerAccountChangeLinePageListApi } from "@/api/modules/finance";
import AccountTransferDrawer from "@/views/finance/capital/platform/components/AccountTransferDrawer.vue";
import AccountWithdrawalDrawer from "@/views/finance/capital/platform/components/AccountWithdrawalDrawer.vue";
import { timestampToDate, convertFenToYuan } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
import dayjs from "dayjs";

const userStore = useUserStore();
const { BizType, AccountCashType, AccChangeType } = userStore.dataType;

const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "id", label: "流水号" },
  {
    prop: "changeValue",
    label: "变更金额",
    render(scope) {
      return convertFenToYuan(scope.row.changeValue) || "--";
    }
  },
  { prop: "consumerId", label: "用户ID" },
  { prop: "consumerName", label: "用户名称" },
  {
    prop: "bizType",
    label: "业务类型",
    search: { el: "select" },
    enum: BizType,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "bizId", label: "单据编号", search: { el: "input" }, isShow: false },
  { prop: "action", label: "单据编号", width: 200 },
  {
    prop: "accountCashType",
    label: "资金类型",
    search: { el: "select" },
    enum: AccountCashType,
    fieldNames: { label: "value", value: "type" }
  },
  {
    prop: "createTime",
    label: "操作时间",
    render(scope) {
      return timestampToDate(scope.row.createTime) || "--";
    }
  },
  {
    prop: "yyyyMM",
    label: "交易月份",
    search: {
      el: "date-picker",
      props: {
        type: "month",
        "value-format": "YYYYMM"
      },
      defaultValue: dayjs(Date.now()).format("YYYYMM")
    },
    isShow: false
  },
  {
    prop: "changeType",
    label: "变更操作",
    search: { el: "select" },
    enum: AccChangeType,
    fieldNames: { label: "value", value: "type" }
  }
]);

const initParam = reactive({});
const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify({ ...params, accountType: "cash" }));
  return consumerAccountChangeLinePageListApi(newParams);
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
const AccountTransferDrawerRef = ref<InstanceType<typeof AccountTransferDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  row.id = row.bizId;
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: undefined,
    getTableList: TableProRef.value?.getTableList
  };
  if (row.bizType === "withdraw") {
    AccountWithdrawalDrawerRef.value?.acceptParams(params);
  } else {
    AccountTransferDrawerRef.value?.acceptParams(params);
  }
};
</script>
