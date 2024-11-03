<template>
  <el-dialog
    v-model="visible"
    title="商品分类"
    width="500"
    destroy-on-close
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="100" size="large">
      <el-form-item label="分类名称" prop="classifyName">
        <el-input v-model="formData.classifyName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类图标" prop="iconUrl" required>
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :limit="1"
          accept="image/*"
          v-model:file-list="fileList"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
          :on-change="onChange"
          class="uploader-limit-1"
        >
          <el-icon><plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number style="width: 100%" v-model="formData.sort" :min="1" placeholder="请输入排序" />
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
    <el-dialog v-model="dialogVisible" title="预览">
      <img class="max-w-full" :src="dialogImageUrl" />
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { Plus } from "@element-plus/icons-vue";
import type { UploadFile, UploadProps } from "element-plus";
import { addProductCategory } from "@/api/modules/business";

const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore();
const visible = ref(false);
const fileList = ref<UploadFile[]>([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const formData = reactive<BusinessSpace.ProductCategory>({
  parentClassifyCode: "",
  classifyCode: "",
  classifyType: "",
  classifyName: "",
  sort: 1,
  statusCode: "",
  iconUrl: ""
});
const rules = reactive<FormRules<Omit<BusinessSpace.ProductCategory, "respList">>>({
  classifyName: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
  statusCode: [{ required: true, message: "请选择状态", trigger: "blur" }],
  iconUrl: [{ required: true, message: "分类图标", trigger: "blur" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await addProductCategory(formData);
    visible.value = false;
    ruleFormRef.value?.resetFields();
    emit("success");
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};
const onChange = (uploadFile: UploadFile) => {
  formData.iconUrl = uploadFile.url!;
};
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const handleRemove = () => {
  fileList.value = [];
};
defineExpose({
  open() {
    visible.value = true;
  }
});
</script>
