<template>
  <el-card style="width: 100%">
    <template #header>
      <div class="card-header">
        <span>开户行及银行账户信息</span>
      </div>
    </template>
    <div class="flex">
      <div
        v-for="(item, index) in cardList"
        :key="index"
        class="w-400px pl-20px pr-20px item_card"
        :class="{ invalidStatus: item.statusCode === 'invalid', 'mr-20px': index % 2 === 0 }"
      >
        <p>公司编号：{{ item!.merchantNum  || "--" }}</p>
        <p>公司名称：{{ item!.merchantName  || "--" }}</p>
        <p>支付服务商：{{ PayCpMap[item!.payCpCode] || "--" }}</p>
        <p>开户银行：{{ item!.bankName || "-" }}</p>
        <p>银行账号：{{ item!.bankCardNumber || "-" }}</p>
        <p>账号状态：{{ item!.statusName || "-" }}</p>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="tsx" name="AccountInfo">
import { ref } from "vue";

import { accountQueryListApi } from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import type { ResultData } from "@/api/interface";
import { ArrayToObject } from "@/utils/index";

const userStore = useUserStore();
const { PayCp } = userStore.dataType;
const PayCpMap = ArrayToObject(PayCp, "type", "value");

const cardList = ref<any[]>([]);

const getBankMerDetail = async () => {
  const id = userStore.userInfo.id;
  if (!id) return;
  const res: ResultData = await accountQueryListApi({ id });
  cardList.value = res.data || [];
};
getBankMerDetail();
</script>

<style scoped lang="scss">
.flex {
  .item_card {
    box-sizing: border-box;
    width: calc(50% - 10px);
    border: 1px solid #e4e7ed;
    border-radius: 5px;
  }
  .invalidStatus {
    background-color: #e4e7ed;
    background-image: url("@/assets/images/invalid.png");
    background-repeat: no-repeat;
    background-position: 95% 80%;
    background-size: 62px 48px;
  }
}
</style>
