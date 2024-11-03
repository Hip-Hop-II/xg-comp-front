<template>
  <div>
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
          :class="{ invalidStatus: item.statusCode === 'invalid' }"
        >
          <p>公司编号：{{ item!.merchantNum }}</p>
          <p>公司名称：{{ item!.merchantName }}</p>
          <p>开户银行：{{ item!.bankName || "-" }}</p>
          <p>银行账号：{{ item!.bankCardNumber || "-" }}</p>
          <p>账号状态：{{ item!.statusName || "-" }}</p>
        </div>
      </div>
    </el-card>

    <el-card class="w-100% mt-10px">
      <template #header>
        <div class="card-header">
          <span>公域店铺回款账户配置</span>
        </div>
      </template>
      <div class="bg-#e4e7ed" v-if="shopList.length > 0">
        <el-segmented
          v-model="shopActive"
          :options="shopList"
          block
          :style="{ width: shopList.length < 3 ? shopList.length + 1 + '00px' : '100%' }"
        >
          <template #default="{ item }">
            <div class="flex flex-col items-center gap-2 p-2" @click="getMerchantDetail(item.id, item.shopName)">
              <div>{{ item.shopName }}</div>
              <div v-if="item.statusName">{{ item.statusName }}</div>
            </div>
          </template>
        </el-segmented>
      </div>
      <el-form
        v-if="shopList.length > 0"
        ref="ruleFormRef"
        label-width="130px"
        label-suffix=" :"
        :rules="rules"
        :model="formData"
        class="mt-20px"
      >
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="店铺 ID" prop="merchantNum">
              <el-input v-model="formData!.platformShopNo" placeholder="请输入" disabled />
            </el-form-item>
            <el-form-item label="店铺名称" prop="merchantName">
              <el-input v-model="formData!.shopName" placeholder="请输入" disabled />
            </el-form-item>
            <el-form-item label="appID" prop="appId">
              <el-input v-model="formData!.appId" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="秘钥" prop="appSecret">
              <el-input v-model="formData!.appSecret" :rows="5" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-row justify="center">
              <el-button type="primary" @click="saveClick">保存</el-button>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-steps direction="vertical" :active="activeStep">
              <el-step :title="titleName + '订单号录入'">
                <template #description>
                  <el-input v-model="formData!.poNum" placeholder="请输入" class="w-200px mr-8px" />
                  <el-button type="primary" @click="orderClick">订单验证</el-button>
                </template>
              </el-step>
              <el-step :title="'系统订单查询结果'">
                <template #description>
                  <div>{{ titleName }}订单号：{{orderDetail!.poNum || "--"}}</div>
                  <div>{{ timestampToDate(orderDetail!.poTime) }}</div>
                </template>
              </el-step>
              <el-step :title="titleName + '订单同步接口验证' + (FundOrderStatusMap[orderDetail!.statusCode] || '--')" />
            </el-steps>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="CollectionAccount">
import { ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";

import {
  accountQueryListApi,
  merchantShopQueryListApi,
  merchantShopDetailApi,
  merchantShopSaveApi,
  merchantShopPoCheckApi
} from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import type { ResultData } from "@/api/interface";
import { timestampToDate, ArrayToObject } from "@/utils/index";

const userStore = useUserStore();
const { FundOrderStatus } = userStore.dataType;
const FundOrderStatusMap = ArrayToObject(FundOrderStatus, "type", "value");

const cardList = ref<any[]>([]);
const shopList = ref([]);
const shopActive = ref("");
const titleName = ref("");

const formData = ref<any>({});
const rules = reactive({
  merchantNum: [{ required: true, message: "必填" }],
  merchantName: [{ required: true, message: "必填" }]
});

const getBankMerDetail = async () => {
  const id = userStore.userInfo.id;
  if (!id) return;
  const res: ResultData = await accountQueryListApi({ id });
  cardList.value = res.data;
};
getBankMerDetail();

const getMerchantShopQueryList = async () => {
  const id = userStore.userInfo.id;
  if (!id) return;
  const res: ResultData = await merchantShopQueryListApi({ id });
  shopList.value = res.data || [];
  shopList.value.map((item: any) => {
    item.value = item.id;
  });
  if (res.data?.length > 0) {
    getMerchantDetail(res.data[0].id);
    shopActive.value = res.data[0].value;
    titleName.value = res.data[0].shopName.slice(0, -2);
  }
};
getMerchantShopQueryList();

const getMerchantDetail = async (id: string, name?: string) => {
  if (!id) return;
  titleName.value = name?.slice(0, -2) || "";
  const res: ResultData = await merchantShopDetailApi({ id });
  formData.value = res.data || {};
};

const ruleFormRef = ref<FormInstance>();
const saveClick = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...formData.value
      };
      const res: ResultData = await merchantShopSaveApi(params);
      console.log(11111, res);
      ElMessage.success({ message: `保存成功！` });
    } catch (error) {
      console.error(error);
    }
  });
};

const activeStep = ref(0);
const orderDetail = ref<any>({});
const orderClick = () => {
  merchantShopPoCheckApi({
    ...formData.value
  }).then((res: ResultData) => {
    orderDetail.value = res.data;
    activeStep.value = 2;
  });
};
</script>

<style scoped lang="scss">
.flex {
  .item_card {
    border: 1px solid #e4e7ed;
    border-radius: 5px;
  }
  .item_card + .item_card {
    margin-left: 30px;
  }
  .invalidStatus {
    background-color: #e4e7ed;
    background-image: url("@/assets/images/invalid.png");
    background-repeat: no-repeat;
    background-position: 92% 80%;
    background-size: 62px 48px;
  }
}
</style>
