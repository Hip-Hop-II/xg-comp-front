<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('充值')">发起充值</el-button>
      </template>
      <!-- 表格操作 -->
      <template #action="scope">
        <!-- 银行账户充值状态和操作
        1. 待处理的：才有获取汇款结果 deal
        2. 只有起草中、审核中、退回和失败，才有撤销 create approve back failed
        3. 所有状态都有查看 -->
        <el-button
          v-if="scope.row!.statusCode==='deal'"
          type="primary"
          link
          :icon="Connection"
          @click="openDrawer('汇款结果', scope.row)"
        >
          汇款结果
        </el-button>
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button
          v-if="cancelList.includes(scope.row.statusCode)"
          type="primary"
          link
          :icon="Back"
          @click="openDrawer('撤销', scope.row)"
        >
          撤销
        </el-button>
      </template>
    </TablePro>

    <AccountRechargeDrawer ref="AccountRechargeDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="AccountRecharge">
import { reactive, ref } from "vue";
import { View, Back, CirclePlus, Connection } from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { getAccountRechargeListApi, merchantBankFundRechargeCreateApi, rechargeCancelApi } from "@/api/modules/finance";
import AccountRechargeDrawer from "./components/AccountRechargeDrawer.vue";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate, convertFenToYuan } from "@/utils";
import dayjs from "dayjs";

const userStore = useUserStore();
const { FundOrderStatus } = userStore.dataType;

const cancelList = ["create", "approve", "back", "failed"];
// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
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
  { prop: "orderCode", label: "充值编号", search: { el: "input" }, width: 100 },
  {
    prop: "money",
    label: "充值金额",
    width: 100,
    render(scope) {
      return convertFenToYuan(scope.row.money) || "--";
    }
  },
  { prop: "bankName", label: "开户银行", width: 100 },
  { prop: "bankCardNumber", label: "银行账号", width: 100 },
  { prop: "remark", label: "充值说明", width: 100 },
  { prop: "bankAccountName", label: "收单机构", width: 100 },
  {
    prop: "startTime",
    label: "发起时间",
    width: 100,
    render(scope) {
      return timestampToDate(scope.row.startTime) || "--";
    }
  },
  {
    prop: "endTime",
    label: "完成时间",
    width: 100,
    render(scope) {
      return timestampToDate(scope.row.endTime) || "--";
    }
  },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: FundOrderStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "statusMsg", label: "状态说明", width: 100 },
  { prop: "action", label: "操作", fixed: "right", width: 230 }
]);

const initParam = reactive({});
const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getAccountRechargeListApi(newParams);
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const AccountRechargeDrawerRef = ref<InstanceType<typeof AccountRechargeDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "充值" ? merchantBankFundRechargeCreateApi : title === "撤销" ? rechargeCancelApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  AccountRechargeDrawerRef.value?.acceptParams(params);
};
</script>
