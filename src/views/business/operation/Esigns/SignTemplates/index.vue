<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="eleSignTemplatePageListApi" :data-callback="dataCallback">
      <template #tableHeader>
        <el-button type="primary" @click="onCreate()" class="ml-3">添加模版</el-button>
      </template>
      <template #action="scope">
        <el-button type="primary" link @click="onCreate(scope.row)">修改名称</el-button>
        <el-popconfirm title="确定要修改模版内容吗?" @confirm="onModify(scope.row)">
          <template #reference>
            <el-button type="primary" link>修改内容</el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" link @click="onView(scope.row)">详情</el-button>
      </template>
    </TablePro>
    <operation-modal ref="modalRef" @success="onSuccess" />
    <detail-drawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { eleSignTemplatePageListApi, eleSignTemplateContentUpdateApi, eleSignTemplateDetailApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import OperationModal from "./components/OperationModal.vue";
import DetailDrawer from "./components/DetailDrawer.vue";

const modalRef = ref<any>();
const drawerRef = ref<any>();
const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const columns = reactive<ColumnProps[]>([
  {
    type: "index",
    label: "序号",
    width: 70
  },
  {
    prop: "templateName",
    label: "模版名称",
    search: { el: "input", props: { placeholder: "请输入模版名称" } }
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.BaseStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "action", label: "操作", fixed: "right", width: 260 }
]);

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const onCreate = (data?: BusinessSpace.SignTemplate) => {
  modalRef.value?.open(data);
};
const onModify = async (row: BusinessSpace.SignTemplate) => {
  const res = await eleSignTemplateContentUpdateApi({ id: row.id, returnUrl: window.location.href });
  window.location.href = res.data.url;
};
const onView = async (row: BusinessSpace.SignTemplate) => {
  const res = await eleSignTemplateDetailApi({ id: row.id, returnUrl: window.location.href });
  drawerRef.value?.open(res.data);
};
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
</script>
