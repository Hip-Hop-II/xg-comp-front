<template>
  <el-dialog
    v-model="visible"
    title="规格设置"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="规格">
        <el-input v-model="formData.goodsModel" placeholder="请输入规格" />
      </el-form-item>
      <el-form-item label="售价" prop="sellPrice">
        <el-input-number style="width: 100%" v-model="formData.sellPrice" placeholder="请输入售价" :min="0.01" />
      </el-form-item>
      <el-form-item label="成本价">
        <el-input-number style="width: 100%" v-model="formData.costPrice" placeholder="请输入成本价" :min="0.01" />
      </el-form-item>
      <el-form-item label="库存" prop="inventoryCount">
        <el-input-number style="width: 100%" v-model="formData.inventoryCount" placeholder="请输入库存" :min="1" />
      </el-form-item>
      <el-form-item label="库存阈值" prop="inventoryLowNum">
        <el-input-number style="width: 100%" v-model="formData.inventoryLowNum" placeholder="请输入库存阈值" :min="1" />
      </el-form-item>
      <el-form-item label="商品编号">
        <el-input v-model="formData.goodsNum" placeholder="请输入商品编号" />
      </el-form-item>
      <el-form-item label="重量kg" prop="weight">
        <el-input-number style="width: 100%" v-model="formData.weight" placeholder="请输入重量" :min="0.01" />
      </el-form-item>
      <el-form-item label="体积cm" prop="volume">
        <el-input v-model="formData.volume" placeholder="请输入体积，比如10x20x30" />
      </el-form-item>
      <el-form-item label="状态" prop="statusCode">
        <el-select v-model="formData.statusCode" placeholder="请选择状态">
          <el-option v-for="item in userStore.dataType.BaseStatus" :key="item.value" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { addGoodsModel } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";

interface FormData {
  modelImgUrls: string;
  costPrice: number | undefined;
  goodsModel: string;
  goodsNum: string;
  inventoryCount: number | undefined;
  sellPrice: number | undefined;
  volume: string;
  weight: number | undefined;
  inventoryLowNum: number | undefined;
  statusCode: string;
}

const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore();
const visible = ref(false);
const formData = reactive<FormData>({
  modelImgUrls: "",
  costPrice: undefined,
  goodsModel: "",
  goodsNum: "",
  inventoryCount: undefined,
  sellPrice: undefined,
  volume: "",
  weight: undefined,
  inventoryLowNum: undefined,
  statusCode: ""
});
const rules = reactive<FormRules<typeof formData>>({
  sellPrice: [{ required: true, message: "请输入售价", trigger: "blur" }],
  inventoryCount: [{ required: true, message: "请输入库存数量", trigger: "blur" }],
  inventoryLowNum: [{ required: true, message: "请输入库存阈值", trigger: "blur" }],
  weight: [{ required: true, message: "请输入重量", trigger: "blur" }],
  volume: [{ required: true, message: "请输入体积", trigger: "blur" }],
  statusCode: [{ required: true, message: "请选择状态", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    const data = toRaw(formData);
    data.sellPrice! *= 100;
    if (data.costPrice) {
      data.costPrice *= 100;
    }
    await addGoodsModel(formData);
    visible.value = false;
    ruleFormRef.value?.resetFields();
    emit("success");
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};

defineExpose({
  open() {
    visible.value = true;
  }
});
</script>
