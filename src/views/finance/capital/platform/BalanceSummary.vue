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
    <div class="mb-20px">
      资金结算账户：主要是用于将账户资金提现、转账、结算、佣金下发等
      <span class="color-#e4393c font-size-22px">实际资金支付</span>
      账户，默认资金结算账户有且只能有一个。
    </div>
    <div class="flex flex-wrap">
      <div
        v-for="(item, index) in cardList"
        :key="index"
        class="pl-20px pr-20px mb-20px item_card"
        :class="{ invalidStatus: item.status === 'invalid', 'mr-20px': index % 2 === 0 }"
      >
        <div v-if="item.outSettleAccount === 1" class="position">{{ "默认资金结算账户" }}</div>
        <div
          v-if="item.accountType !== 'cash' && item.accountType !== 'points' && item.outSettleAccount !== 1"
          class="position"
          @click="settingClick(item.id)"
        >
          {{ "设置资金结算账户" }}
        </div>
        <p>收单机构: {{ AccountTypeMap[item.accountType] }}</p>
        <p>商户编号: {{ item.outMerchantNo }}</p>
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
import { merchantAccountFundQueryBalanceApi, merchantAccountFundOutSettleAccountApi } from "@/api/modules/finance";
import type { ResultData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import { ArrayToObject, convertFenToYuan } from "@/utils/index";

const userStore = useUserStore();
const { AccountType } = userStore.dataType;

const AccountTypeMap = ArrayToObject(AccountType, "type", "value");

const cardList = ref<any>([]);
const RefreshClick = async (id: string, index: number) => {
  const res: ResultData = await merchantAccountFundQueryBalanceApi({ id });
  cardList.value[index] = res.data[0];
};
const getList = () => {
  merchantAccountFundQueryBalanceApi({}).then((res: ResultData) => {
    cardList.value = res.data;
  });
};
getList();

const settingClick = (id: string) => {
  merchantAccountFundOutSettleAccountApi({
    id
  }).then((res: ResultData) => {
    ElMessage({
      type: "success",
      message: res.msg
    });
    getList();
  });
};
</script>

<style scoped lang="scss">
.flex {
  .item_card {
    position: relative;
    box-sizing: border-box;
    width: calc(50% - 10px);
    border: 1px solid #e4e7ed;
    border-radius: 5px;
    .position {
      position: absolute;
      top: 10px;
      right: 20px;
      color: blue;
    }
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
