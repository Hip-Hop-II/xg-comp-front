<template>
  <el-dialog
    v-model="visible"
    title="分润规则"
    :width="props.width || 800"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="flex">
      <slot />
      <div>
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="120" size="large">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="formData.ruleName" placeholder="请输入规则名称" />
          </el-form-item>
          <el-form-item label="起止时间" prop="rangeTime">
            <el-date-picker
              v-model="formData.rangeTime"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="自动结算天数" prop="autoSettleDay">
            <el-input-number placeholder="请输入自动结算天数" v-model="formData.autoSettleDay" :min="1" style="width: 100%" />
            <div>系统收货后，多少天后启动分佣结算</div>
          </el-form-item>
          <el-form-item label="规则简述" prop="statusMsg">
            <el-input
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入规则简述"
              :rows="4"
              :maxlength="100"
              resize="none"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="状态" v-if="formData.id">
            <el-select v-model="formData.statusCode" placeholder="请选择状态">
              <el-option v-for="item in userStore.dataType.BaseStatus" :key="item.value" :label="item.value" :value="item.type" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存规则信息</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
        <split-rule-lines v-if="formData.id" :rule-id="formData.id" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import SplitRuleLines from "./SplitRuleLines.vue";
import { timestampToDate } from "@/utils";
import { useUserStore } from "@/stores/modules/user";

const props = defineProps<{
  width?: number;
  handleSubmit: (data: Inventory.SplitRuleFormData) => Promise<string>;
}>();

type FormData = Inventory.SplitRuleFormData & { rangeTime: (string | number)[] };
const userStore = useUserStore();
const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const formData = reactive<FormData>({
  id: "",
  ruleName: "",
  autoSettleDay: 1,
  startTime: "",
  endTime: "",
  remark: "",
  statusCode: "",
  rangeTime: []
});

const rules = reactive<FormRules<FormData>>({
  rangeTime: [{ required: true, message: "请选择起止时间", trigger: "change" }],
  ruleName: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
  autoSettleDay: [{ required: true, message: "请输入自动结算天数", trigger: "blur" }]
});

const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    const data = toRaw(formData);
    data.startTime = new Date(`${data.rangeTime[0]} 00:00:00`).getTime();
    data.endTime = new Date(`${data.rangeTime[1]} 23:59:59`).getTime();
    formData.id = await props.handleSubmit(data);
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};
const onReset = () => {
  ruleFormRef.value?.resetFields();
};

defineExpose({
  open(data?: Inventory.SplitRule) {
    formData.id = data?.id || "";
    formData.ruleName = data?.ruleName || "";
    formData.autoSettleDay = data?.autoSettleDay || 1;
    formData.remark = data?.remark || "";
    formData.statusCode = data?.statusCode || "";
    formData.rangeTime = data
      ? [timestampToDate(data.startTime, "YYYY-MM-DD")!, timestampToDate(data.endTime, "YYYY-MM-DD")!]
      : [];
    visible.value = true;
  }
});
</script>
