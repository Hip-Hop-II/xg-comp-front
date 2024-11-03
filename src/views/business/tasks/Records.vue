<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="merchantTaskConsumerPageListApi" :data-callback="dataCallback">
      <template #action="scope">
        <el-button type="primary" link @click="onException(scope.row)">异常处置</el-button>
      </template>
    </TablePro>
    <risk-consumer ref="riskConsumerRef" @success="onSuccess" />
    <risk-task ref="riskTaskRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { merchantTaskConsumerPageListApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate } from "@/utils";
import RiskConsumer from "./components/RiskConsumer.vue";
import RiskTask from "./components/RiskTask.vue";
import { ElButton } from "element-plus";

const userStore = useUserStore();
const riskConsumerRef = ref<any>();
const riskTaskRef = ref<any>();
const TableProRef = ref<ProTableInstance>();
const columns = reactive<ColumnProps[]>([
  {
    prop: "serialNum",
    label: "任务编号",
    search: { el: "input" },
    width: 140
  },
  {
    prop: "taskName",
    label: "任务名称",
    width: 140
  },
  {
    prop: "taskType",
    label: "任务类型",
    width: 120,
    enum: userStore.dataType.TaskType,
    fieldNames: { label: "value", value: "type" }
  },
  {
    prop: "points",
    label: "奖励积分",
    width: 120
  },
  {
    prop: "money",
    label: "奖励金额",
    width: 120,
    render(scope) {
      return scope.row.money && (scope.row.money / 100).toFixed(2);
    }
  },
  {
    prop: "startTime",
    label: "做任务时间（开始-结束）",
    render: scope => {
      return `${timestampToDate(scope.row.startTime)} - ${timestampToDate(scope.row.endTime)}`;
    },
    width: 340
  },
  {
    prop: "violateRule",
    label: "是否违规",
    width: 120,
    render(scope) {
      return h(
        ElButton,
        {
          type: "primary",
          link: true,
          onClick: () => {
            riskTaskRef.value?.open(scope.row);
          }
        },
        {
          default: () => (scope.row.violateRule === 1 ? "是" : "否")
        }
      );
    }
  },
  {
    prop: "violateHandle",
    label: "违规处置",
    enum: userStore.dataType.RiskRuleTask,
    fieldNames: { label: "value", value: "type" },
    width: 220
  },
  {
    prop: "violateReason",
    label: "违规原因",
    width: 120
  },
  {
    prop: "taskMerchantNum",
    label: "任务商户编号",
    width: 120
  },
  {
    prop: "taskMerchantName",
    label: "任务商户名称",
    width: 120
  },
  {
    prop: "conumerId",
    label: "会员编号",
    width: 180
  },
  {
    prop: "conumerName",
    label: "会员姓名",
    width: 120
  },
  {
    prop: "conumerPhone",
    label: "会员手机号",
    width: 120
  },
  {
    prop: "riskRule",
    label: "异常处置规则",
    enum: userStore.dataType.RiskRuleConsumer,
    fieldNames: { label: "value", value: "type" },
    width: 120
  },
  {
    prop: "riskReason",
    label: "异常处置原因",
    width: 120
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.ConsumerTaskStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select" },
    width: 120
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

const onException = (data: any) => {
  riskConsumerRef.value?.open(data);
};
</script>
