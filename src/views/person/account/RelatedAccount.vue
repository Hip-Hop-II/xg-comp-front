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
        <!-- 关联方账户中状态和操作的控制
        1. 待审核，只有审核和查看链接、处置  apply
        2. 签约中，只有发送短信签约链接和查看、处置 sign
        3. 正常、冻结、停用、已注销，只有查看和处置 success freeze canceled closed
        4. 失败，只有查看、审核 failed
        5. 黑名单只有查看 black -->
        <el-button
          v-if="applyList.includes(scope.row!.statusCode)"
          type="primary"
          link
          :icon="ChatDotSquare"
          @click="openDrawer('审核', scope.row)"
        >
          审核
        </el-button>
        <el-button
          v-if="handleList.includes(scope.row!.statusCode)"
          type="primary"
          link
          :icon="Connection"
          @click="openDrawer('处置', scope.row)"
        >
          处置
        </el-button>
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button v-if="scope.row!.statusCode==='sign'" type="primary" link :icon="MessageBox" @click="sendSignClick(scope.row)">
          发送短信签约链接
        </el-button>
      </template>
    </TablePro>

    <ActionDrawer ref="ActionDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { View, ChatDotSquare, MessageBox, Connection } from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { relatedPartyAccountsListApi, approveApi, riskApi, sendSignApi } from "@/api/modules/person";
import ActionDrawer from "./components/ActionDrawer.vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const { MerchantStatus, MerchantType } = userStore.dataType;

const handleList = ["apply", "sign", "success", "freeze", "closed", "canceled"];
const applyList = ["apply", "failed"];
// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "merchantNum", label: "关联方编号", search: { el: "input" } },
  { prop: "merchantName", label: "关联方名称", search: { el: "input" } },
  { prop: "subMerchantRole", label: "关联方角色" },
  {
    prop: "merchantType",
    label: "类型",
    enum: MerchantType,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "contractUserName", label: "联系人" },
  { prop: "contractTelephone", label: "联系电话" },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: MerchantStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "statusMsg", label: "状态说明" },
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
  return relatedPartyAccountsListApi(newParams);
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
const ActionDrawerRef = ref<InstanceType<typeof ActionDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "审核" ? approveApi : title === "处置" ? riskApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  ActionDrawerRef.value?.acceptParams(params);
};

const sendSignClick = (row: any = {}) => {
  sendSignApi({
    id: row.merchantNum
  }).then(() => {
    ElMessage.success({ message: `发送成功！` });
    TableProRef.value?.getTableList();
  });
};
</script>
