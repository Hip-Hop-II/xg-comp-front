<template>
  <el-dialog
    v-model="visible"
    title="添加任务"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="120" size="large">
      <el-form-item label="任务名称" prop="taskId">
        <el-select v-model="formData.taskId" placeholder="请选择任务名称">
          <el-option v-for="item in tasks" :key="item.id" :label="item.taskName" :value="item.id" />
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
import { merchantTaskAddApi } from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";

interface FormData {
  taskId: string;
  isTop: string;
  taskOrder: number;
}

const { YesOrNo } = useUserStore().dataType;
const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const tasks = shallowRef<Inventory.MerchantTask[]>([]);
const formData = reactive<FormData>({
  taskId: "",
  isTop: "",
  taskOrder: 1
});

const rules = reactive<FormRules<FormData>>({
  taskId: [{ required: true, message: "请选择任务", trigger: "change" }],
  isTop: [{ required: true, message: "请选择是否置顶", trigger: "change" }],
  taskOrder: [{ required: true, message: "请输入排序值", trigger: "blur" }]
});

const emit = defineEmits<{
  success: [];
}>();

const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await merchantTaskAddApi(formData);
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
  open(data: Inventory.MerchantTask[]) {
    tasks.value = data;
    visible.value = true;
  }
});
</script>
