<template>
  <el-dialog
    v-model="visible"
    title="违规处置"
    width="700"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="80" size="large">
      <template v-if="!showNext">
        <el-form-item label="达成标准">{{ record?.taskStandard }}</el-form-item>
        <el-form-item label="实际结果">{{ record?.realTaskValue }}</el-form-item>
        <el-form-item label="违规" prop="violateRule">
          <el-select v-model="formData.violateRule" placeholder="请选择是否违规">
            <el-option v-for="item in YesOrNo" :key="item.type" :label="item.value" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="处置" prop="violateHandle">
          <el-select v-model="formData.violateHandle" placeholder="请选择处置方式" @change="onChange">
            <el-option v-for="item in RiskRuleTask" :key="item.type" :label="item.value" :value="item.type" />
          </el-select>
          <span v-if="formData.violateHandle === 'freeze'">{{ tips.value }}</span>
        </el-form-item>
        <el-form-item label="原因" prop="violateReason">
          <el-input
            v-model="formData.violateReason"
            type="textarea"
            placeholder="请输入违规原因"
            :rows="4"
            :maxlength="100"
            resize="none"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="leading-normal w-full">注:</div>
          <div class="leading-normal w-full">
            1.冻结本任务赠送积分、现金后，会持续保持冻结中，无法到达用户账户中。需要手动解冻：
          </div>
          <div class="leading-normal w-full ml-4">
            1.1 将“违规处置修改为暂不处置或解冻本任务赠送的积分、现金”后积分、现金会到达用户账户中
          </div>
          <div class="leading-normal w-full ml-4">
            1.2 将“违规处置修改为取消本任务赠送的积分、现金”后，积分、现金将不会到达用户账户中
          </div>
          <div class="leading-normal w-full">
            2.冻结本任务赠送积分、现金有效期为15天，15天后由系统自动变更为“暂不处置或解冻本任务赠送的积分、现金”，积分、现金会到达用户账户
          </div>
          <div class="leading-normal w-full">
            3.取消本任务赠送的积分、现金：<span class="text-red font-medium">为不可逆操作，一旦取消赠送数据将无法恢复</span>
          </div>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" class="w-full" @click="onSave">保存</el-button>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label-width="0">
          <div class="w-full">当前违规处置是</div>
          <div class="text-red w-full font-medium text-xl">{{ tips.label }}</div>
          <div class="w-full">{{ tips.value }}</div>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button class="w-40" type="primary" @click="onSubmit">确定</el-button>
          <el-button class="w-40" @click="showNext = false">取消</el-button>
        </el-form-item>
      </template>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { taskRecordViolationApi } from "@/api/modules/business";
import dayjs from "dayjs";

interface FormData {
  id: string;
  violateRule: string;
  violateReason: string;
  violateHandle: string;
}

const { RiskRuleTask, YesOrNo } = useUserStore().dataType;
const showNext = ref(false);
const ruleFormRef = ref<FormInstance>();
const record = shallowRef<any>();
const tips = reactive({
  label: "",
  value: ""
});
const visible = ref(false);
const formData = reactive<FormData>({
  id: "",
  violateRule: "",
  violateReason: "",
  violateHandle: ""
});

const rules = reactive<FormRules<FormData>>({
  violateRule: [{ required: true, message: "请选择是否违规", trigger: "change" }],
  violateHandle: [{ required: true, message: "请选择违规方式", trigger: "change" }],
  violateReason: [{ required: true, message: "请输入违规原因", trigger: "blur" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onChange = (value: string) => {
  tips.label = RiskRuleTask.find(item => item.type === value)?.value;
  if (value === "no_dispose") {
    tips.value = `预计到账时间：${dayjs(record.value?.endTime - 0 + 24 * 60 * 60 * 1000).format("YYYY-MM-DD")}`;
  } else if (value === "freeze") {
    tips.value = `冻结时间：${dayjs().format("YYYY-MM-DD HH:mm:ss")} 至 ${dayjs(Date.now() + 15 * 24 * 60 * 60 * 1000).format(
      "YYYY-MM-DD HH:mm:ss"
    )}`;
  } else {
    tips.value = "本操作不可逆，一旦取消赠送数据将无法恢复";
  }
};
const onSave = async () => {
  try {
    await ruleFormRef.value?.validate();
    showNext.value = true;
  } catch (error) {}
};
const onSubmit = async () => {
  await taskRecordViolationApi(formData);
  visible.value = false;
  emit("success");
};

defineExpose({
  open(data: any) {
    record.value = data;
    showNext.value = false;
    formData.id = data.id;
    formData.violateHandle = data.violateHandle || "";
    formData.violateReason = data.violateReason || "";
    formData.violateRule = data.violateRule || "";
    visible.value = true;
  }
});
</script>
