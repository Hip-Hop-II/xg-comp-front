<template>
  <el-dialog
    v-model="visible"
    title="更新库存"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="120" size="large">
      <el-form-item label="排序" prop="inventoryLowNum">
        <el-input-number placeholder="请输入库存阈值" v-model="formData.inventoryLowNum" :min="1" />
      </el-form-item>
      <el-form-item label="排序" prop="inventoryCount">
        <el-input-number placeholder="请输入库存数量" v-model="formData.inventoryCount" :min="1" />
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
import { updateGoodsModel } from "@/api/modules/business";

interface FormData {
  inventoryCount: number;
  inventoryLowNum: number;
}

const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const modelDetails = shallowRef<BusinessSpace.GoodsItemModel>();
const formData = reactive<FormData>({
  inventoryCount: 0,
  inventoryLowNum: 0
});

const rules = reactive<FormRules<FormData>>({
  inventoryCount: [{ required: true, message: "请输入库存数量", trigger: "blur" }],
  inventoryLowNum: [{ required: true, message: "请输入库存阈值", trigger: "blur" }]
});

const emit = defineEmits<{
  success: [];
}>();

const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await updateGoodsModel({ ...modelDetails.value, ...formData });
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
  open(data: BusinessSpace.GoodsItemModel) {
    modelDetails.value = data;
    formData.inventoryCount = data.inventoryCount;
    formData.inventoryLowNum = data.inventoryLowNum;
    visible.value = true;
  }
});
</script>
