<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="merchantTaskPageListApi" :data-callback="dataCallback">
      <template #action="scope">
        <el-button type="primary" link @click="onSet(scope.row)">设置分润</el-button>
      </template>
    </TablePro>
    <split-rule-modal ref="modalRef" :handle-submit="onSubmit" :width="1100">
      <template #default>
        <div class="flex-1 border-r border-r-solid border-gray-2 mr-4">
          <el-form label-suffix=":" :label-width="120" size="large">
            <el-form-item label="广告商户">{{ taskDetails?.taskMerchantName }}</el-form-item>
            <el-form-item label="任务名称">{{ taskDetails?.taskName }}</el-form-item>
            <el-form-item label="任务类型">{{ userStore.getDataTypeValue("TaskType", taskDetails?.taskType) }}</el-form-item>
            <el-form-item label="是否上架">
              {{ userStore.getDataTypeValue("YesOrNo", taskDetails?.taskStatus) }}
            </el-form-item>
            <el-form-item label="是否置顶">
              {{ userStore.getDataTypeValue("YesOrNo", taskDetails?.isTop) }}
            </el-form-item>
            <el-form-item label="排序">
              {{ taskDetails?.taskOrder }}
            </el-form-item>
            <el-form-item label="奖励积分">{{ taskDetails?.points }}</el-form-item>
            <el-form-item label="奖励金额">{{ ((taskDetails?.money || 0) / 100).toFixed(2) }}元</el-form-item>
            <el-form-item label="开始时间">{{ timestampToDate(taskDetails?.startTime) }}</el-form-item>
            <el-form-item label="结束时间">{{ timestampToDate(taskDetails?.endTime) }}</el-form-item>
            <el-form-item label="广告类型">{{
              userStore.getDataTypeValue("AdType", taskDetails?.taskResp.taskAdDetail.adType)
            }}</el-form-item>
            <template v-if="taskDetails?.taskResp.taskAdDetail.adType === 'video'">
              <el-form-item label="广告时长">{{ taskDetails?.taskResp.taskAdDetail.duration }}秒</el-form-item>
              <el-form-item label="预览">
                <video controls :src="taskDetails?.taskResp.taskAdDetail.adUrl" :width="300" :height="200" />
              </el-form-item>
            </template>
          </el-form>
        </div>
      </template>
    </split-rule-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import {
  merchantTaskDetailApi,
  merchantTaskPageListApi,
  splitRuleAddApi,
  splitRuleTaskDetailApi,
  splitRuleTaskSaveApi
} from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate } from "@/utils";
import SplitRuleModal from "./components/SplitRuleModal.vue";

const userStore = useUserStore();
const { TaskType, TaskStatus, YesOrNo } = userStore.dataType;
const TableProRef = ref<ProTableInstance>();
const taskDetails = shallowRef<Inventory.MerchantTaskDetail>();
const modalRef = ref<any>();
const initParam = reactive({
  splitBizType: "task",
  bizId: ""
});

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
  {
    prop: "taskName",
    label: "任务名称",
    width: 160
  },
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
      return timestampToDate(scope.row.startTime) || "";
    },
    width: 180
  },
  {
    prop: "endTime",
    label: "结束时间",
    render: scope => {
      return timestampToDate(scope.row.endTime) || "";
    },
    width: 180
  },
  {
    prop: "taskStatus",
    label: "上架",
    search: {
      el: "select",
      props: {
        placeholder: "请选择上架状态"
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
  { prop: "action", label: "操作", fixed: "right", width: 100 }
]);
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
const onSubmit = async (data: Inventory.SplitRuleFormData): Promise<string> => {
  if (data.id) {
    await splitRuleTaskSaveApi({ ...data, ...initParam, taskId: initParam.bizId });
    TableProRef.value?.getTableList();
    return data.id;
  }
  const res = await splitRuleAddApi({ ...data, ...initParam });
  TableProRef.value?.getTableList();
  return res.data.id;
};
const onSet = async (data: Inventory.MerchantTask) => {
  initParam.bizId = data.id;
  let splitData: Inventory.SplitRule | undefined;
  if (data.splitRuleId) {
    const res = await splitRuleTaskDetailApi({ taskId: data.id });
    splitData = res.data;
  }
  const task = await merchantTaskDetailApi({ id: data.id });
  taskDetails.value = task.data;
  modalRef.value?.open(splitData);
};
</script>
