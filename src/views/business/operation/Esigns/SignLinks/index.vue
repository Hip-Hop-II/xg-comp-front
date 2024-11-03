<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="eleSignTaskPageListApi" :data-callback="dataCallback">
      <template #tableHeader>
        <el-button type="primary" @click="onCreate" class="ml-3">发起签约</el-button>
      </template>
      <template #action="scope">
        <el-button type="primary" v-if="scope.row.statusCode === 'sign'" link @click="onView(scope.row.id)">查看进度</el-button>
        <el-button type="primary" link @click="onDetail(scope.row.id)">详情</el-button>
      </template>
    </TablePro>
    <sign-drawer ref="drawerRef" />
    <sign-progress ref="progressRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { eleSignTaskPageListApi, eleSignTaskViewApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate } from "@/utils";
import SignDrawer from "./components/SignDrawer.vue";
import SignProgress from "./components/SignProgress.vue";

const drawerRef = ref<any>();
const progressRef = ref<any>();
const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const columns = reactive<ColumnProps[]>([
  {
    type: "index",
    label: "序号",
    width: 70
  },
  {
    prop: "taskCode",
    label: "任务编码",
    width: 200
  },
  {
    prop: "taskName",
    label: "任务名称",
    search: { el: "input", props: { placeholder: "请输入任务名称" } },
    width: 200
  },
  {
    prop: "expiresTime",
    label: "签约截止时间",
    render(scope: any) {
      return timestampToDate(scope.row.expiresTime);
    },
    width: 200
  },
  {
    prop: "outTradeNo",
    label: "三方业务流水号",
    width: 200
  },
  {
    prop: "startTime",
    label: "开始时间",
    render(scope: any) {
      return timestampToDate(scope.row.startTime);
    },
    width: 200
  },
  {
    prop: "endTime",
    label: "结束时间",
    render(scope: any) {
      return timestampToDate(scope.row.endTime);
    },
    width: 200
  },
  {
    prop: "statusMsg",
    label: "说明",
    width: 200
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.EleSignStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择状态" } },
    width: 200
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

const onCreate = () => {
  drawerRef.value?.open();
};

const onView = (id: string) => {
  progressRef.value?.open(id);
};

const onDetail = async (id: string) => {
  const res = await eleSignTaskViewApi({ id });
  window.open(res.data.url);
};
</script>
