<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      action="#"
      v-loading="loading"
      element-loading-text="上传中..."
      :list-type="props.bizType === 'openAccountVideoUrl' ? null : 'picture-card'"
      :auto-upload="false"
      v-model:file-list="fileList"
      :limit="limit"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :on-change="onChange"
      :class="{ hide: fileList.length >= limit }"
    >
      <el-button v-if="props.bizType === 'openAccountVideoUrl'" :disabled="fileList.length > 0" type="primary">
        选择视频
      </el-button>
      <el-icon v-else><Plus /></el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible" title="预览" width="800px" append-to-body>
      <video
        v-if="props.bizType === 'openAccountVideoUrl'"
        :src="dialogImageUrl"
        controls
        style="display: block; max-width: 100%; margin: 0 auto"
      />
      <img v-else :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadFile, UploadProps } from "element-plus";
import { uploadToOss } from "@/api/modules/upload";
import { saveFileApi, delFileApi } from "@/api/modules/finance";
import type { ResultData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();

const props = defineProps({
  modelValue: [String, Object, Array],
  // 图片数量限制
  limit: {
    type: Number,
    default: 5
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5
  },
  bizType: {
    type: String,
    default: ""
  },
  showFileList: {
    type: Boolean,
    default: true
  },
  // 详情时回显不展示上传框
  type: [String]
});

const emit = defineEmits(["update:modelValue"]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref<any>([]);
const loading = ref(false);

watch(
  () => props.modelValue,
  val => {
    if (val) {
      fileList.value = val;
    } else {
      fileList.value = [];
      return [];
    }
  },
  { deep: true, immediate: true }
);

const beforeRemove = uploadFile => {
  return ElMessageBox.confirm(`此操作将删除该图片, 是否继续?`).then(
    () => {
      const id = uploadFile.id;
      if (!id) return true;
      delFileApi({
        merchantNum: userStore.userInfo.merchantNum,
        fileId: id
      })
        .then(res => {
          ElMessage.success({ message: `${res.msg}` });
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    () => false
  );
};
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
  fileList.value = [];
};

const onChange = (uploadFile: UploadFile) => {
  loading.value = true;
  uploadToOss({
    file: uploadFile.raw!,
    url: uploadFile.url!,
    bizType: props.bizType
  }).then(res => {
    fileList.value[fileList.value.length - 1].status = "success";
    fileList.value[fileList.value.length - 1].url = res.viewUrl;
    emit("update:modelValue", fileList.value);
    console.log(1111, res);
    saveFileApi({
      merchantNum: userStore.userInfo.merchantNum,
      fileType: props.bizType,
      filePath: res.url
    }).then((res: ResultData) => {
      loading.value = false;
      fileList.value[fileList.value.length - 1].id = res.data.fileId;
      ElMessage.success({ message: `${res.msg}` });
    });
  });
};

// 预览
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
</script>

<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}
</style>
