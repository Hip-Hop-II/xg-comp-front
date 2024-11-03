<template>
  <el-card style="width: 100%">
    <template #header>
      <div class="card-header">
        <span>账户总览</span>
      </div>
    </template>
    <div class="flex mb-20px">
      <div>{{ userStore.userInfo.merchantName || "-" }}</div>
      <div class="ml-40px">{{ userStore.userInfo.merchantNum || "-" }}</div>
    </div>
    <div class="flex">
      <div
        v-for="(item, index) in cardList"
        :key="index"
        class="min-w-600px pl-20px pr-20px item_card"
        :class="{ invalidStatus: item.status === 'invalid', 'mr-20px': index % 2 === 0 }"
      >
        <p>开户银行: {{ item.bankName }}</p>
        <p>银行账号: {{ item.bankCardNumber }}</p>
        <div class="flex pb-20px">
          <div class="w-64px text-align-center mr-10px">
            <div>账户余额</div>
            <el-icon class="cursor-pointer">
              <Refresh @click="RefreshClick(item.id, index)" />
            </el-icon>
          </div>
          <div class="flex-1 text-align-center">
            <div>{{ convertFenToYuan(item.total) }}</div>
            <div>账户金额（元）</div>
          </div>
          <div class="text-align-center mr-10px">
            <div>=</div>
            <div></div>
          </div>
          <div class="flex-1 text-align-center mr-10px">
            <div>{{ convertFenToYuan(item.total - item.freeze) }}</div>
            <div>可用余额（元）</div>
          </div>
          <div class="text-align-center mr-10px">
            <div>+</div>
            <div></div>
          </div>
          <div class="flex-1 text-align-center">
            <div>{{ convertFenToYuan(item.freeze) }}</div>
            <div>冻结余额（元）</div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="tsx" name="AccountInfo">
import { ref } from "vue";
import { queryBalanceSummaryApi } from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import type { ResultData } from "@/api/interface";
import { convertFenToYuan } from "@/utils/index";

const userStore = useUserStore();

const cardList = ref<any>([]);
const RefreshClick = async (id: string, index: number) => {
  const res: ResultData = await queryBalanceSummaryApi({ id });
  cardList.value[index] = res.data[0];
};
const getBalanceSummaryDetail = async () => {
  const res: ResultData = await queryBalanceSummaryApi({});
  cardList.value = res.data;
};
getBalanceSummaryDetail();
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
    background-position: 95% 30%;
    background-size: 62px 48px;
  }
}
</style>
