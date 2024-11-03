<template>
  <el-drawer v-model="visible" title="签约模版详情" size="50%">
    <el-form :model="details" label-width="auto" label-suffix=":" class="break-normal">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="模版名称">{{ details?.templateName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模版状态">{{ userStore.getDataTypeValue("BaseStatus", details?.statusCode) }}</el-form-item>
        </el-col>
      </el-row>
      <div class="py-4 border-t border-t-ececec border-t-solid" v-for="(item, index) in details?.signFills || []" :key="index">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户角色">{{ item.signUserRole }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型">{{ userStore.getDataTypeValue("SubMerType", item.signUserType) }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-for="(doc, j) in item.fileDocs || []" :key="j">
          <el-col :span="8">
            <el-form-item label="文档ID">{{ doc.docId }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文档名称">{{ doc.docName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="字段ID">{{ doc.fieldId }}</el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import { ref } from "vue";

const userStore = useUserStore();
const visible = ref(false);
const details = shallowRef<BusinessSpace.SignTemplateDetails>();

defineExpose({
  open(data: BusinessSpace.SignTemplateDetails) {
    details.value = data;
    visible.value = true;
  }
});
</script>
