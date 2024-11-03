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
      <!-- <template #tableHeader="">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('积分发放')">积分发放</el-button>
      </template> -->
      <!-- 表格操作 -->
      <template #action="scope">
        <el-button type="primary" link :icon="Connection" @click="openDrawer('异常处置', scope.row)">异常处置</el-button>
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="MessageBox" @click="consumerPwdSetClick(scope.row)">重置密码</el-button>
      </template>
    </TablePro>

    <RegisterDrawer ref="RegisterDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import {
  View,
  MessageBox,
  // CirclePlus,
  Connection
} from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { consumerQueryListApi, consumerPointsApi, consumerPwdSetApi, consumerRiskApi } from "@/api/modules/person";
import RegisterDrawer from "./components/RegisterDrawer.vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const { ConsumerStatus } = userStore.dataType;

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "id", label: "用户ID", search: { el: "input" } },
  { prop: "consumerCode", label: "用户编号", width: 100, search: { el: "input" } },
  { prop: "consumerName", label: "用户姓名", width: 100, search: { el: "input" } },
  { prop: "telephone", label: "用户手机号", width: 120, search: { el: "input" } },
  {
    prop: "auth",
    label: "实名认证",
    width: 100,
    render: scope => {
      return <span>{scope.row.realAuthTime ? "是" : "否"}</span>;
    }
  },
  { prop: "sumWithdrawMoney", label: "累计提现金额", width: 120 },
  { prop: "sumPoMoney", label: "累计消费金额", width: 120 },
  { prop: "sumSellAfterCount", label: "累计售后次数", width: 120 },
  { prop: "totalTaskCount", label: "参与任务次数", width: 120 },
  { prop: "sumPoints", label: "累计获得积分", width: 120 },
  { prop: "realAuthTime", label: "实名认证时间", width: 120 },
  { prop: "lastLoginTime", label: "最后登录时间", width: 120 },
  { prop: "riskRule", label: "风控" },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: ConsumerStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "action", label: "操作", fixed: "right", width: 230 }
]);

// 如果表格需要初始化请求参数，直接定义传给 TablePro (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
// TablePro 实例
const TableProRef = ref<ProTableInstance>();

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 TablePro 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return consumerQueryListApi(newParams);
};

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

// 打开 drawer(新增、查看、编辑)
const RegisterDrawerRef = ref<InstanceType<typeof RegisterDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "积分发放" ? consumerPointsApi : title === "异常处置" ? consumerRiskApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  RegisterDrawerRef.value?.acceptParams(params);
};

const consumerPwdSetClick = (row: any = {}) => {
  consumerPwdSetApi({
    id: row.id
  }).then(() => {
    ElMessage.success({ message: `重置成功！` });
    TableProRef.value?.getTableList();
  });
};
</script>
