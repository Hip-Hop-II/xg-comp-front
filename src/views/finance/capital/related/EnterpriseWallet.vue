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
        <!-- 账户详情：所有状态都可以操作
        状态是账户关闭，没有更多操作 -->
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
    <EnterpriseWalletDrawer ref="EnterpriseWalletDrawerRef" />

    <el-dialog v-model="dialogTableVisible" title="账户详情" width="1200">
      <el-segmented v-model="segmentedValue" :options="options" size="large" class="w-400px mb-10px" />
      <InputRecord v-if="segmentedValue === '入金记录'" />
      <OutputRecord v-if="segmentedValue === '出金记录'" />
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { View, Setting, Connection } from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { subMerchantAccountFundQueryListApi, fundRuleSaveApi } from "@/api/modules/finance";
import EnterpriseWalletDrawer from "./components/EnterpriseWalletDrawer.vue";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate, convertFenToYuan } from "@/utils/index";
import InputRecord from "./components/InputRecord.vue";
import OutputRecord from "./components/OutputRecord.vue";

const userStore = useUserStore();
const { MerchantStatus, MerchantType } = userStore.dataType;
console.log(1111, MerchantStatus, MerchantType);

const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "memberMerchantNum", label: "关联方编号", search: { el: "input" } },
  { prop: "memberMerchantName", label: "关联方名称", search: { el: "input" } },
  {
    prop: "memberMerchantType",
    label: "关联方类型",
    search: { el: "select" },
    enum: MerchantType,
    fieldNames: { label: "value", value: "type" }
  },
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
    prop: "createTime",
    label: "开户时间",
    render: scope => {
      return timestampToDate(scope.row.createTime);
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
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.memberMerchantType = "company";
  return subMerchantAccountFundQueryListApi(newParams);
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const EnterpriseWalletDrawerRef = ref<InstanceType<typeof EnterpriseWalletDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "账户设置" ? fundRuleSaveApi : title === "异常处置" ? undefined : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  EnterpriseWalletDrawerRef.value?.acceptParams(params);
};

const segmentedValue = ref("入金记录");
const options = ["入金记录", "出金记录"];
const dialogTableVisible = ref(false);
const dialogClick = row => {
  console.log(row.id);
  dialogTableVisible.value = true;
  segmentedValue.value = "入金记录";
};
</script>
