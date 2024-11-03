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
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('创建开户申请')">创建开户申请</el-button>
      </template>
      <!-- 表格操作 -->
      <template #action="scope">
        <!-- 银行VB开户状态和操作：状态加操作
        1. 开户中：查看开户结果 apply
        2. 开户成功、冻结中：查看
        3. 开户失败：查看开户结果和删除 failed -->
        <el-button
          v-if="resultList.includes(scope.row.statusCode)"
          type="primary"
          link
          :icon="ChatDotSquare"
          @click="QueryResultClick(scope.row)"
        >
          查询开户结果
        </el-button>
        <el-popconfirm v-if="scope.row.statusCode === 'failed'" title="确定要该项内容吗？" @confirm="deleteClick(scope.row)">
          <template #reference>
            <el-button type="primary" link :icon="Delete">删除</el-button>
          </template>
        </el-popconfirm>

        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
      </template>
    </TablePro>

    <BankAccountDrawer ref="BankAccountDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { View, ChatDotSquare, CirclePlus, Delete } from "@element-plus/icons-vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import {
  merchantBankQueryListApi,
  merchantBankCommitApi,
  merchantBankDeleteApi,
  merchantBankQueryResultApi
} from "@/api/modules/finance";
import BankAccountDrawer from "./components/BankAccountDrawer.vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const { BankCardStatus } = userStore.dataType;

const resultList = ["apply", "failed"];
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "id", label: "申请编号" },
  { prop: "merchantNum", label: "公司编号", search: { el: "input" } },
  { prop: "merchantName", label: "公司名称", search: { el: "input" } },
  { prop: "memberTelephone", label: "法人电话" },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: BankCardStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "statusMsg", label: "状态说明" },
  { prop: "action", label: "操作", fixed: "right", width: 230 }
]);

const initParam = reactive({});
const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return merchantBankQueryListApi(newParams);
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const BankAccountDrawerRef = ref<InstanceType<typeof BankAccountDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "创建开户申请" ? merchantBankCommitApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  BankAccountDrawerRef.value?.acceptParams(params);
};

const deleteClick = (row: any = {}) => {
  merchantBankDeleteApi({
    id: row.id
  }).then(() => {
    ElMessage.success({ message: `删除成功！` });
    TableProRef.value?.getTableList();
  });
};

const QueryResultClick = (row: any = {}) => {
  merchantBankQueryResultApi({
    id: row.id
  }).then(() => {
    TableProRef.value?.getTableList();
  });
};
</script>
