<template>
  <div class="w-full mt-5">
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" size="large">
      <el-form-item label="导航图片" prop="goodsListImg" required :label-width="120">
        <el-space>
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :on-preview="handlePictureCardPreview"
            v-model:file-list="formData.goodsListImg"
            class="uploader-limit-1"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div>
            <p>1.图片尺寸100x100</p>
            <p>2.图片大小不超过1M</p>
            <p>3.只能上传1张图片</p>
          </div>
        </el-space>
      </el-form-item>
      <el-form-item label="详情banner" prop="goodsIndexImg" required :label-width="120">
        <el-space>
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="5"
            accept="image/*"
            multiple
            :on-preview="handlePictureCardPreview"
            v-model:file-list="formData.goodsIndexImg"
            :on-exceed="handleExceed(5)"
            class="uploader-limit-5"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div>
            <p>1.图片尺寸200x200</p>
            <p>2.图片大小不超过1M</p>
            <p>3.只能上传5张图片</p>
          </div>
        </el-space>
      </el-form-item>
      <el-form-item label="产品详情图" prop="goodsDetailImg" required :label-width="120">
        <el-space>
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="10"
            accept="image/*"
            multiple
            :on-preview="handlePictureCardPreview"
            v-model:file-list="formData.goodsDetailImg"
            :on-exceed="handleExceed(10)"
            class="uploader-limit-10"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div>
            <p>1.图片大小不超过1M</p>
            <p>2.只能上传10张图片</p>
          </div>
        </el-space>
      </el-form-item>
      <el-form-item style="margin-bottom: 0" label="产品参数" required :label-width="120">
        <el-button type="primary" link @click="formData.goodsParameter.push({ label: '', value: '' })">添加产品参数</el-button>
      </el-form-item>
      <div class="flex items-center mb-6" v-for="(item, index) in formData.goodsParameter" :key="index">
        <el-form-item
          style="margin-bottom: 0"
          :label-width="120"
          :prop="`item.${index}.label`"
          :rules="[{ required: true, message: `参数名${index + 1}不能为空` }]"
        >
          <el-input :placeholder="`请输入参数名${index + 1}`" style="width: 130px" v-model="item.label" />
        </el-form-item>
        <span class="mx-2">:</span>
        <el-form-item
          style="margin-right: 10px; margin-bottom: 0"
          :prop="`item.${index}.value`"
          :rules="[{ required: true, message: `参数值${index + 1}不能为空` }]"
        >
          <el-input :placeholder="`请输入参数值${index + 1}`" style="width: 300px" v-model="item.value" />
        </el-form-item>
        <el-button type="danger" link @click="deleteGoodsParam(index)" v-if="index > 0">删除</el-button>
      </div>
      <el-form-item :label-width="120">
        <el-button>上一步</el-button>
        <el-button type="primary" @click="onSubmit">保存，下一步</el-button>
      </el-form-item>
    </el-form>
    <image-preview ref="imagePreviewRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules, UploadUserFile, UploadFile } from "element-plus";
import { addGoodsSecondInfo } from "@/api/modules/business";
import { Plus } from "@element-plus/icons-vue";
import ImagePreview from "@/components/ImagePreview/index.vue";

interface FormDatas {
  id: number;
  goodsListImg: UploadUserFile[];
  smallImg: UploadUserFile[];
  goodsParameter: { label: string; value: string }[];
  goodsDetailImg: UploadUserFile[];
  goodsIndexImg: UploadUserFile[];
}

const ruleFormRef = ref<FormInstance>();
const imagePreviewRef = ref<any>();
const visible = ref(false);
const formData = reactive<FormDatas>({
  id: 0,
  goodsListImg: [],
  smallImg: [],
  goodsParameter: [{ label: "", value: "" }],
  goodsDetailImg: [],
  goodsIndexImg: []
});
const rules = reactive<FormRules<FormDatas>>({
  goodsListImg: [{ required: true, message: "请上传导航图片" }],
  goodsIndexImg: [{ required: true, message: "请上传详情banner图", trigger: "change" }],
  goodsDetailImg: [{ required: true, message: "请上传产品详情图", trigger: "change" }]
});
const deleteGoodsParam = (index: number) => {
  formData.goodsParameter.splice(index, 1);
};
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await addGoodsSecondInfo(formData);
    visible.value = false;
    ruleFormRef.value?.resetFields();
  } catch (error) {}
};
const handleExceed = (total: number) => {
  return (files: File[], uploadFiles: UploadUserFile[]) => {
    ElMessage.error(
      `当前限制选择${total}个文件，本次选择了${files.length}个文件，共选择了${files.length + uploadFiles.length}个文件`
    );
  };
};
const handlePictureCardPreview = (uploadFile: UploadFile) => {
  imagePreviewRef.value?.open(uploadFile.url);
};
</script>
