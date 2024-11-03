<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="merchantTaskPageListApi" :data-callback="dataCallback">
      <template #tableHeader>
        <el-button type="primary" @click="onAdd">从任务库中选择任务</el-button>
      </template>
      <template #action="scope">
        <el-button type="primary" link @click="onEdit(scope.row)">编辑</el-button>
      </template>
    </TablePro>
    <benefit-add-modal ref="addModalRef" @success="onSuccess" />
    <benefit-edit-modal ref="editModalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { merchantTaskPageListApi, taskPageListApi } from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import BenefitAddModal from "./BenefitAddModal.vue";
import BenefitEditModal from "./BenefitEditModal.vue";
import TablePro from "@/components/TablePro/index.vue";
import { timestampToDate } from "@/utils";

const addModalRef = ref<any>();
const editModalRef = ref<any>();
const { TaskType, TaskStatus, YesOrNo } = useUserStore().dataType;
const TableProRef = ref<ProTableInstance>();
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
const columns = reactive<ColumnProps[]>([
  {
    prop: "serialNum",
    label: "任务编号",
    width: 140,
    search: {
      el: "input",
      props: {
        placeholder: "请输入任务编号"
      }
    }
  },
  {
    prop: "taskType",
    label: "任务类型",
    width: 100,
    search: {
      el: "select",
      props: {
        placeholder: "请选择任务类型"
      }
    },
    enum: TaskType,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "taskName", label: "任务名称", width: 160 },
  { prop: "taskMerchantName", label: "广告商户", width: 100 },
  { prop: "isTop", label: "置顶", enum: YesOrNo, fieldNames: { label: "value", value: "type" }, width: 80 },
  { prop: "taskOrder", label: "排序", width: 60 },
  { prop: "points", label: "奖励积分", width: 100 },
  {
    prop: "money",
    label: "奖励金额",
    width: 100,
    render(scope) {
      return `${(scope.row.money / 100).toFixed(2)}元`;
    }
  },
  {
    prop: "startTime",
    label: "开始时间",
    render: scope => {
      return `${timestampToDate(scope.row.startTime)}`;
    },
    width: 180
  },
  {
    prop: "endTime",
    label: "结束时间",
    render: scope => {
      return `${timestampToDate(scope.row.endTime)}`;
    },
    width: 180
  },
  { prop: "viewCount", label: "展现次数", width: 100 },
  { prop: "clickCount", label: "点击数量", width: 100 },
  { prop: "finshCount", label: "完成数量", width: 100 },
  {
    prop: "taskStatus",
    label: "是否上架",
    search: {
      el: "select",
      props: {
        placeholder: "请选择是否上架"
      }
    },
    enum: YesOrNo,
    fieldNames: { label: "value", value: "type" },
    width: 100
  },
  {
    prop: "statusCode",
    label: "状态",
    search: {
      el: "select",
      props: {
        placeholder: "请选择状态"
      }
    },
    enum: TaskStatus,
    fieldNames: { label: "value", value: "type" },
    width: 100
  },
  { prop: "statusMsg", label: "说明", width: 160 },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const onAdd = async () => {
  const res = await taskPageListApi({ startPage: false });
  addModalRef.value?.open(res.data || []);
};
const onEdit = (data: Inventory.MerchantTask) => {
  editModalRef.value?.open(data);
};
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
</script>
