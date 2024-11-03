<template>
  <div class="flex flex-wrap">
    <el-card v-for="(item, index) in cardList" :key="index" class="flex-1 mb-10px mr-10px">
      <img :src="item" style="width: 100%" />
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="ClarifyIndex">
import { ref } from "vue";
import { merchantHelpDocPageListApi } from "@/api/modules/business";

const cardList = ref();
const getDetail = async () => {
  const res = await merchantHelpDocPageListApi("bankVBAcc");
  if (res.data && res.data.length > 0) {
    let trimmedString = res.data[0].docContent.trim().replace(/^\[|\]$/g, "");
    cardList.value = trimmedString.split(", ");
  }
};
getDetail();
</script>
