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
      <!-- 表格 header 按钮 -->
      <template #tableHeader="">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('积分发放', multipleSelection[0])">积分发放</el-button>
      </template>
      <!-- 表格操作 -->
      <template #action="scope">
        <el-button type="primary" link :icon="Connection" @click="openDrawer('异常处置', scope.row)">异常处置</el-button>
        <el-button type="primary" link :icon="View" @click="openDrawer('账户汇总', scope.row)">账户汇总</el-button>
      </template>
    </TablePro>

    <UserIntegralDrawer ref="UserIntegralDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { View, Connection, CirclePlus } from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { consumerAccountPageListApi, consumerAccountSubmitApi, consumerAccountRiskApi } from "@/api/modules/finance";
import UserIntegralDrawer from "./components/UserIntegralDrawer.vue";
import { useUserStore } from "@/stores/modules/user";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const { ConsumerStatus } = userStore.dataType;

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "selection", label: "", width: 60 },
  { type: "index", label: "序号", width: 70 },
  { prop: "consumerId", label: "用户ID" },
  { prop: "consumerCode", label: "用户编号", search: { el: "input" } },
  { prop: "consumerName", label: "用户姓名", search: { el: "input" } },
  { prop: "total", label: "积分总额" },
  {
    prop: "",
    label: "可用积分",
    render: scope => {
      return <span>{scope.row.total - scope.row.freeze}</span>;
    }
  },
  { prop: "freeze", label: "冻结积分" },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: ConsumerStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "action", label: "操作", fixed: "right", width: 230 }
]);

const initParam = reactive({});
// TablePro 实例
const TableProRef = ref<ProTableInstance>();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify({ ...params, accountType: "points" }));
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

const UserIntegralDrawerRef = ref<InstanceType<typeof UserIntegralDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  if (title === "积分发放" && multipleSelection.value.length === 0) {
    ElMessage.error({ message: "请勾选数据" });
    return;
  }
  const params = {
    title,
    isView: title === "账户汇总",
    row: { ...row },
    api: title === "积分发放" ? consumerAccountSubmitApi : title === "异常处置" ? consumerAccountRiskApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  UserIntegralDrawerRef.value?.acceptParams(params);
};
</script>
