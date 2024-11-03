<template>
  <el-card style="max-width: 600px" header="开卡步骤设置">
    <div class="flex items-center mb-6" v-for="item in formData" :key="item.id">
      <span class="text-sm">{{ item.docTitle }}：</span>
      <el-input size="large" v-model="item.docContent" class="flex-1" :placeholder="`请输入${item.docTitle}`" />
      <el-button size="large" type="primary" @click="submitForm(item)" class="mx-4" :disabled="!validateUrl(item.docContent)">
        修改
      </el-button>
      <a
        :href="item.docContent"
        v-if="validateUrl(item.docContent)"
        target="_blank"
        class="text-sm decoration-none text-gray-400 hover-decoration-underline"
      >
        预览
      </a>
    </div>
    <p class="text-sm text-red">*请输入可访问的http或者https开头的链接</p>
  </el-card>
</template>

<script setup lang="ts">
import { merchantHelpDocPageListApi, merchantHelpDocUpdateApi } from "@/api/modules/business";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { validateUrl } from "@/utils";

const formData = ref<BusinessSpace.MerchantHelpDoc[]>([]);

const submitForm = async (data: BusinessSpace.MerchantHelpDoc) => {
  await merchantHelpDocUpdateApi(data);
  ElMessage.success(data.docTitle + "修改成功");
};

onMounted(async () => {
  const res = await merchantHelpDocPageListApi("openMobileAcc");
  formData.value = res.data;
});
</script>
