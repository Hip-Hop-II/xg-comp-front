<template>
  <div class="flex flex-wrap">
    <el-card v-for="(item, index) in cardList" :key="index" class="flex-1 mb-10px mr-10px">
      <template #header>{{ item.docTitle }}</template>
      <img v-if="item.docContentType === 'img'" :src="item.docContent" style="width: 100%" />
      <div v-else>{{ item.docContent }}</div>
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="ClarifyIndex">
import { ref } from "vue";
import { merchantHelpDocPageListApi } from "@/api/modules/business";

const cardList = ref();
const getDetail = async () => {
  const res = await merchantHelpDocPageListApi("suMerAcc");
  if (res.data && res.data.length > 0) {
    res.data.map(item => {
      if (item.docContent.includes("https")) {
        item.docContent = item.docContent.trim().replace(/^\[|\]$/g, "");
      }
    });
    cardList.value = res.data;
  }
};
getDetail();
</script>
