<template>
  <el-dialog
    v-model="visible"
    title="导入设备信息"
    width="600"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="90" size="large">
      <el-form-item label="设备分类" prop="classifyCode">
        <el-cascader
          v-model="formData.classifyCode"
          class="w-full"
          placeholder="请选择设备分类"
          :options="categories"
          :props="{ value: 'classifyCode', label: 'classifyName', children: 'respList', expandTrigger: 'hover' }"
        />
      </el-form-item>
      <el-form-item label="生产商" prop="manufacturerMerchantNum">
        <el-select v-model="formData.manufacturerMerchantNum" placeholder="请选择生产商">
          <el-option
            v-for="item in formData.merchants"
            :key="item.merchantNum"
            :label="item.merchantName"
            :value="item.merchantNum"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="导入文件" prop="file">
        <el-upload
          ref="uploadRef"
          drag
          action="#"
          :limit="1"
          :auto-upload="false"
          :on-change="onChange"
          style="width: 100%"
          accept=".xls,.xlsx"
          :on-exceed="handleExceed"
          :on-remove="onRemove"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">文件拖拽到此处或<em>点击选择文件</em></div>
          <template #tip>
            <div class="el-upload__tip">文件格式：xls/xlsx</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { genFileId } from "element-plus";
import type { FormInstance, FormRules, UploadFile, UploadInstance, UploadRawFile } from "element-plus";
import { merchantDeviceImportAddApi } from "@/api/modules/inventory";

interface FormData {
  classifyCode: string[];
  merchants: Inventory.ManufacturerMerchants[];
  manufacturerMerchantNum: string;
  file: File | undefined;
}

const categories = shallowRef<BusinessSpace.ProductCategory[]>([]);
const uploadRef = ref<UploadInstance>();
const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const formData = reactive<FormData>({
  classifyCode: [],
  merchants: [],
  manufacturerMerchantNum: "",
  file: undefined
});
const rules = reactive<FormRules<FormData>>({
  classifyCode: [{ required: true, message: "请选择设备分类", trigger: "change" }],
  manufacturerMerchantNum: [{ required: true, message: "请选择生产商", trigger: "change" }],
  file: [{ required: true, message: "请选择导入文件", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await merchantDeviceImportAddApi({
      classifyCode: formData.classifyCode[formData.classifyCode.length - 1],
      manufacturerMerchantNum: formData.manufacturerMerchantNum!,
      file: formData.file!
    });
    visible.value = false;
    ruleFormRef.value?.resetFields();
    emit("success");
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};
const onChange = (file: UploadFile) => {
  formData.file = file.raw;
  ruleFormRef.value?.validate();
};
const handleExceed = (files: File[]) => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  formData.file = files[0];
  ruleFormRef.value?.validate();
};
const onRemove = () => {
  formData.file = undefined;
};
const onCancel = () => {
  ruleFormRef.value?.resetFields();
  visible.value = false;
};
defineExpose({
  open(data: any) {
    categories.value = data.categories;
    formData.merchants = data.merchants;
    visible.value = true;
  }
});
</script>
