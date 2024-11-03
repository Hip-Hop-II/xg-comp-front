<template>
  <div>
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="queryLogisticComps"
      :height="200"
      :max-height="400"
      :data-callback="dataCallback"
    >
      <template #tableHeader="">
        <el-button type="primary" @click="onCreate">新增物流公司</el-button>
      </template>
      <template #action="scope">
        <el-popconfirm title="确定要删除这个物流公司数据吗?">
          <template #reference>
            <el-button type="danger" link @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </TablePro>
    <logistic-comp-modal ref="logisticCompModalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { queryLogisticComps, deleteLogisticComp } from "@/api/modules/business";
import LogisticCompModal from "./LogisticCompModal.vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";

const TableProRef = ref<ProTableInstance>();
const logisticCompModalRef = ref<any>();
const userStore = useUserStore();
const columns = reactive<ColumnProps[]>([
  { prop: "deliveryCompanyName", label: "物流公司" },
  {
    prop: "defaultDeliveryCompany",
    label: "是否默认",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const onCreate = () => {
  logisticCompModalRef.value?.open();
};
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
const onDelete = async (data: BusinessSpace.LogisticCompDataItem) => {
  await deleteLogisticComp([data.id]);
  ElMessage.success("删除成功");
  onSuccess();
};
</script>
