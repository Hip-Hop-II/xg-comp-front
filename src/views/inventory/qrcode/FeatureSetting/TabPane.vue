<template>
  <el-form
    ref="ruleFormRef"
    :model="formData"
    :rules="rules"
    label-suffix=":"
    label-width="auto"
    size="large"
    style="width: 600px"
  >
    <el-form-item label="首页模版" prop="mallTemplateCode">
      <el-select v-model="formData.mallTemplateCode" placeholder="请选择首页模版">
        <el-option v-for="item in MallTemplate" :key="item.type" :label="item.value" :value="item.type" />
      </el-select>
    </el-form-item>
    <el-form-item label="商城名称" prop="mallName">
      <el-input v-model="formData.mallName" style="width: 100%" placeholder="请输入商城名称" />
    </el-form-item>
    <el-form-item label="商城URL" prop="mallUrl">
      <el-input v-model="formData.mallUrl" style="width: 100%" placeholder="请输入商城URL" />
    </el-form-item>
    <el-form-item label="企微客服二维码" prop="companyWechatServiceImage">
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :limit="1"
        accept="image/*"
        v-model:file-list="fileList"
        :on-remove="onRemove"
        :on-preview="handlePictureCardPreview"
        :on-change="onChange"
        class="uploader-limit-1"
      >
        <el-icon><plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="客服电话" prop="serviceTelephone">
      <el-input v-model="formData.serviceTelephone" style="width: 100%" placeholder="请输入客服电话" />
    </el-form-item>
    <el-form-item label="客服时间" prop="serviceTime">
      <el-input v-model="formData.serviceTime" style="width: 100%" placeholder="请输入客服时间" />
    </el-form-item>
    <el-form-item :label-width="130">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
  <el-dialog v-model="dialogVisible" title="预览">
    <img class="max-w-full" :src="dialogImageUrl" />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { mallConfigurateUpdateApi, queryMallConfigurateDetail } from "@/api/modules/business";
import type { FormInstance, FormRules, UploadFile, UploadProps, UploadUserFile } from "element-plus";
import { ElMessage } from "element-plus";
import { uploadToOss } from "@/api/modules/upload";
import { validateUrlRegx } from "@/utils";

const props = defineProps<{
  mallId: string;
}>();

interface RuleForm {
  id: string;
  mallTemplateCode: string;
  mallName: string;
  mallUrl: string;
  companyWechatServiceImage: string;
  serviceTelephone: string;
  serviceTime: string;
}

const { MallTemplate } = useUserStore().dataType;
const fileList = ref<UploadUserFile[]>([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();

const formData = reactive<RuleForm>({
  id: "",
  mallTemplateCode: MallTemplate.length === 1 ? MallTemplate[0].type : "",
  mallName: "",
  mallUrl: "",
  companyWechatServiceImage: "",
  serviceTelephone: "",
  serviceTime: ""
});

const rules = reactive<FormRules<RuleForm>>({
  mallTemplateCode: [{ required: true, message: "请选择首页模版", trigger: "change" }],
  mallName: [{ required: true, message: "请输入商城名称", trigger: "blur" }],
  mallUrl: [
    { required: true, message: "请输入商城URL", trigger: "blur" },
    { pattern: validateUrlRegx, message: "商城URL格式不正确", trigger: "blur" }
  ],
  companyWechatServiceImage: [{ required: true, message: "请上传企微客服二维码", trigger: "change" }],
  serviceTelephone: [{ required: true, message: "请输入客服电话", trigger: "blur" }],
  serviceTime: [{ required: true, message: "请选择客服时间", trigger: "blur" }]
});

const submitForm = async () => {
  await ruleFormRef.value?.validate();
  if (fileList.value.length && fileList.value[0].raw) {
    const res = await uploadToOss({
      file: fileList.value[0].raw,
      bizType: "mallCompanyWechatServiceImage",
      url: formData.companyWechatServiceImage
    });
    formData.companyWechatServiceImage = res.url;
  }
  await mallConfigurateUpdateApi(formData);
  ElMessage.success("商城信息修改成功");
};

const resetForm = () => {
  ruleFormRef.value?.resetFields();
};
const onChange = (uploadFile: UploadFile) => {
  formData.companyWechatServiceImage = uploadFile.url!;
};
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const onRemove = () => {
  fileList.value = [];
};
onMounted(async () => {
  const res = await queryMallConfigurateDetail(props.mallId);
  formData.id = res.data.id;
  formData.mallTemplateCode = res.data.mallTemplateCode;
  formData.mallName = res.data.mallName;
  formData.mallUrl = res.data.mallUrl;
  formData.companyWechatServiceImage = res.data.companyWechatServiceImage;
  formData.serviceTelephone = res.data.serviceTelephone;
  formData.serviceTime = res.data.serviceTime;
  if (res.data.companyWechatServiceImage) {
    fileList.value = [
      {
        name: "",
        url: res.data.companyWechatServiceImage
      }
    ];
  }
});
</script>
