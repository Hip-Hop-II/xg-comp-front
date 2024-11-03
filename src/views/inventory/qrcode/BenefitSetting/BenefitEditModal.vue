<template>
  <el-dialog
    v-model="visible"
    title="任务详情"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="120" size="large">
      <el-form-item label="广告商户">{{ taskDetails?.taskMerchantName }}</el-form-item>
      <el-form-item label="任务名称">{{ taskDetails?.taskName }}</el-form-item>
      <el-form-item label="任务类型">{{ TaskType.find(t => t.type === taskDetails?.taskType)?.value }}</el-form-item>
      <el-form-item label="是否上架" prop="taskStatus">
        <el-select v-model="formData.taskStatus" placeholder="请选择是否上架">
          <el-option v-for="item in YesOrNo" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTop">
        <el-select v-model="formData.isTop" placeholder="请选择是否置顶">
          <el-option v-for="item in YesOrNo" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="taskOrder">
        <el-input-number placeholder="请输入排序" v-model="formData.taskOrder" :min="1" />
      </el-form-item>
      <el-form-item label="状态" prop="statusCode">
        <el-select v-model="formData.statusCode" placeholder="请选择状态">
          <el-option v-for="item in TaskStatus" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="奖励积分">{{ taskDetails?.points }}</el-form-item>
      <el-form-item label="奖励金额">{{ ((taskDetails?.money || 0) / 100).toFixed(2) }}元</el-form-item>
      <el-form-item label="开始时间">{{ timestampToDate(taskDetails?.startTime) }}</el-form-item>
      <el-form-item label="结束时间">{{ timestampToDate(taskDetails?.endTime) }}</el-form-item>
      <el-form-item label="广告类型">{{
        AdType.find(t => t.type === taskDetails?.taskResp.taskAdDetail.adType)?.value
      }}</el-form-item>
      <template v-if="taskDetails?.taskResp.taskAdDetail.adType === 'video'">
        <el-form-item label="广告时长">{{ taskDetails?.taskResp.taskAdDetail.duration }}秒</el-form-item>
        <el-form-item label="预览">
          <video controls :src="taskDetails?.taskResp.taskAdDetail.adUrl" :width="300" :height="200" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, shallowRef } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { merchantTaskDetailApi, merchantTaskUpdateApi } from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate } from "@/utils";

interface FormData {
  id: string;
  isTop: number;
  taskStatus: string;
  taskOrder: number;
  statusCode: string;
}

const { YesOrNo, TaskType, AdType, TaskStatus } = useUserStore().dataType;
const ruleFormRef = ref<FormInstance>();
const taskDetails = shallowRef<Inventory.MerchantTaskDetail>();
const visible = ref(false);
const formData = reactive<FormData>({
  id: "",
  isTop: 0,
  taskStatus: "",
  taskOrder: 1,
  statusCode: ""
});

const rules = reactive<FormRules<FormData>>({
  taskStatus: [{ required: true, message: "请选择是否上架", trigger: "change" }],
  isTop: [{ required: true, message: "请选择是否置顶", trigger: "change" }],
  taskOrder: [{ required: true, message: "请输入排序值", trigger: "blur" }]
});

const emit = defineEmits<{
  success: [];
}>();

const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await merchantTaskUpdateApi(formData);
    emit("success");
    onClose();
  } catch (error) {}
};

const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};
const onClose = () => {
  ruleFormRef.value?.resetFields();
  visible.value = false;
};

defineExpose({
  async open(data: Inventory.MerchantTask) {
    formData.id = data.id;
    formData.isTop = data.isTop;
    formData.taskStatus = data.taskStatus;
    formData.taskOrder = data.taskOrder;
    formData.statusCode = data.statusCode;
    const res = await merchantTaskDetailApi({ id: data.id });
    taskDetails.value = res.data;
    visible.value = true;
  }
});
</script>
