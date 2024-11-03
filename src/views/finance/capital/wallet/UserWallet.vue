<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @selection-change="handleSelectionChange"
    >
      <template #tableHeader="">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('现金发放', multipleSelection[0])">现金发放</el-button>
      </template>
      <template #action="scope">
        <el-button type="primary" link :icon="View" @click="dialogClick(scope.row)">账户详情</el-button>
        <el-button
          v-if="scope.row!.statusCode!=='closed'"
          type="primary"
          link
          :icon="Setting"
          @click="openDrawer('账户设置', scope.row)"
        >
          账户设置
        </el-button>
        <el-button
          v-if="scope.row!.statusCode!=='closed'"
          type="primary"
          link
          :icon="Connection"
          @click="openDrawer('异常处置', scope.row)"
        >
          异常处置
        </el-button>
      </template>
    </TablePro>
    <UserWalletDrawer ref="UserWalletDrawerRef" />

    <el-dialog v-model="dialogTableVisible" title="账户详情" width="1200">
      <el-segmented v-model="segmentedValue" :options="options" size="large" class="w-900px mb-10px" />
      <InputRecord v-if="segmentedValue === '入金记录'" />
      <OutputRecord v-if="segmentedValue === '出金记录'" />
      <RealNameAuthentication v-if="segmentedValue === '实名认证'" />
      <TransactionOrder v-if="segmentedValue === '交易订单明细'" />
      <ComplaintRecords v-if="segmentedValue === '投诉记录'" />
      <AccountSummary v-if="segmentedValue === '账户汇总'" />
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { View, Setting, Connection, CirclePlus } from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import {
  consumerAccountPageListApi,
  consumerAccountSubmitApi,
  consumerAccountRiskApi,
  fundRuleSaveApi
} from "@/api/modules/finance";
import UserWalletDrawer from "./components/UserWalletDrawer.vue";
import { useUserStore } from "@/stores/modules/user";
import InputRecord from "./components/InputRecord.vue";
import OutputRecord from "./components/OutputRecord.vue";
import RealNameAuthentication from "./components/RealNameAuthentication.vue";
import TransactionOrder from "./components/TransactionOrder.vue";
import ComplaintRecords from "./components/ComplaintRecords.vue";
import AccountSummary from "./components/AccountSummary.vue";
import { ElMessage } from "element-plus";
import { convertFenToYuan } from "@/utils";

const userStore = useUserStore();
const { MerchantStatus } = userStore.dataType;

const columns = reactive<ColumnProps[]>([
  { type: "selection", label: "", width: 60 },
  { type: "index", label: "序号", width: 70 },
  { prop: "consumerId", label: "用户ID" },
  { prop: "consumerCode", label: "用户编号", search: { el: "input" } },
  { prop: "consumerName", label: "用户姓名", search: { el: "input" } },
  {
    prop: "total",
    label: "总金额",
    render(scope) {
      return convertFenToYuan(scope.row.total) || "--";
    }
  },
  {
    prop: "useMoney",
    label: "可用金额",
    render: scope => {
      return <span>{convertFenToYuan(scope.row.total - scope.row.freeze)}</span>;
    }
  },
  {
    prop: "freeze",
    label: "冻结金额",
    render(scope) {
      return convertFenToYuan(scope.row.freeze) || "--";
    }
  },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: MerchantStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "statusMsg", label: "说明" },
  { prop: "action", label: "操作", fixed: "right", width: 300 }
]);

const initParam = reactive({});
const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify({ ...params, accountType: "cash" }));
  return consumerAccountPageListApi(newParams);
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const multipleSelection = ref([]);
const handleSelectionChange = (val: any = []) => {
  if (multipleSelection.value.length > 0) {
    ElMessage.error({ message: "只能勾选一条" });
    return;
  }
  multipleSelection.value = val;
};

const UserWalletDrawerRef = ref<InstanceType<typeof UserWalletDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  if (title === "现金发放" && multipleSelection.value.length === 0) {
    ElMessage.error({ message: "请勾选数据" });
    return;
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "现金发放" ? consumerAccountSubmitApi : title === "异常处置" ? consumerAccountRiskApi : fundRuleSaveApi,
    getTableList: TableProRef.value?.getTableList
  };
  UserWalletDrawerRef.value?.acceptParams(params);
};

const segmentedValue = ref("入金记录");
const options = ["入金记录", "出金记录", "实名认证", "交易订单明细", "投诉记录", "账户汇总"];
const dialogTableVisible = ref(false);
const dialogClick = row => {
  console.log(row.id);
  dialogTableVisible.value = true;
  segmentedValue.value = "入金记录";
};
</script>
