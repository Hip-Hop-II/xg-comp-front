<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="merchantAuthorityPageListApi" :data-callback="dataCallback">
      <template #tableHeader>
        <el-button type="primary" @click="onAdd">新增管理员</el-button>
      </template>
      <template #action="scope">
        <el-button type="primary" link @click="onView(scope.row)">编辑</el-button>
        <el-button type="primary" link @click="onCancel(scope.row)">认证链接</el-button>
      </template>
    </TablePro>
    <access-modal ref="modalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { merchantAuthorityPageListApi } from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";
import AccessModal from "./AccessModal.vue";

const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const modalRef = ref<any>();
const columns = reactive<ColumnProps[]>([
  {
    prop: "userName",
    label: "姓名",
    search: { el: "input" }
  },
  {
    prop: "userTelephone",
    label: "联系电话",
    search: { el: "input" }
  },
  {
    prop: "authFunctions",
    label: "权限清单"
  },
  {
    prop: "realAuth",
    label: "是否实名",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" }
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.BaseStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
const onAdd = () => {
  modalRef.value?.open();
};
const onView = (row: any) => {
  console.log(row);
};
const onCancel = (row: any) => {
  console.log(row);
};
</script>
