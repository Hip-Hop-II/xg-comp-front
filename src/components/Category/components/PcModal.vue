<template>
  <el-dialog
    v-model="visible"
    title="商品分类"
    width="500"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="formData"
      ref="ruleFormRef"
      :rules="rules"
      label-suffix=":"
      :label-width="100"
      size="large"
      label-position="left"
    >
      <el-form-item label="分类名称" prop="classifyName">
        <el-input v-model="formData.classifyName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类图标" prop="iconUrl">
        <el-space>
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
          <span>尺寸：180x180</span>
        </el-space>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number style="width: 100%" v-model="formData.sort" :min="1" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="状态" prop="statusCode" v-if="editMode">
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
import type { FormInstance, FormRules, UploadUserFile } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { Plus } from "@element-plus/icons-vue";
import type { UploadFile, UploadProps } from "element-plus";
import { addProductCategory, updateProductCategory } from "@/api/modules/business";
import { nanoid } from "nanoid";
import { queryOssViewUrl, uploadToOss } from "@/api/modules/upload";

const props = defineProps<{ type: string }>();
const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore();
const visible = ref(false);
const editMode = ref(false);
const fileList = ref<UploadUserFile[]>([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const formData = reactive<BusinessSpace.ProductCategory>({
  classifyType: props.type,
  classifyCode: "",
  parentClassifyCode: "0",
  classifyName: "",
  sort: undefined,
  statusCode: "",
  iconUrl: undefined
});
const rules = reactive<FormRules<Omit<BusinessSpace.ProductCategory, "respList">>>({
  classifyName: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
  iconUrl: [{ required: true, message: "请上传分类图标", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    if (fileList.value.length && fileList.value[0].raw) {
      const res = await uploadToOss({ file: fileList.value[0].raw, bizType: "mallClassify", url: formData.iconUrl });
      formData.iconUrl = res.url;
    }
    await ruleFormRef.value?.validate();
    if (formData.id) {
      await updateProductCategory(formData);
    } else {
      await addProductCategory(formData);
    }
    visible.value = false;
    emit("success");
    handleRemove();
  } catch (error) {}
};
const resetFields = () => {
  formData.classifyCode = nanoid(20);
  formData.id = undefined;
  formData.parentClassifyCode = "0";
  formData.classifyName = "";
  formData.statusCode = "";
  formData.sort = undefined;
  formData.iconUrl = undefined;
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
  async open(data?: string | BusinessSpace.ProductCategory) {
    visible.value = true;
    handleRemove();
    editMode.value = false;
    if (data) {
      if (typeof data === "string") {
        resetFields();
        formData.parentClassifyCode = data;
      } else {
        editMode.value = true;
        formData.id = data.id;
        formData.classifyCode = data.classifyCode;
        formData.parentClassifyCode = data.parentClassifyCode;
        formData.classifyName = data.classifyName;
        formData.statusCode = data.statusCode;
        if (data.sort) {
          formData.sort = data.sort;
        }
        if (data.iconUrl) {
          formData.iconUrl = data.iconUrl;
          const viewUrl = await queryOssViewUrl(data.iconUrl);
          fileList.value = [{ url: viewUrl, name: "" }];
        }
      }
    } else {
      resetFields();
    }
  }
});
</script>
