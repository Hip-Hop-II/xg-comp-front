<template>
  <TablePro
    ref="TableRURef"
    :columns="RuColumns"
    :request-api="getTableList"
    :init-param="initParam"
    :data-callback="dataCallback"
    :pagination="false"
  />
</template>

<script setup lang="tsx" name="InputRecord">
import { useUserStore } from "@/stores/modules/user";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import { subMerchantAccountFundQueryListApi } from "@/api/modules/finance";

const userStore = useUserStore();
const { MerchantStatus, MerchantType } = userStore.dataType;

const initParam = reactive({});
const RuColumns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  {
    prop: "merchantType",
    label: "入金类型",
    search: { el: "select" },
    enum: MerchantType,
    fieldNames: { label: "value", value: "type" },
    isShow: false
  },
  { prop: "merchantNum", label: "入金编号", search: { el: "input" } },
  { prop: "merchantNum", label: "任务时间" },
  { prop: "merchantNum", label: "入金时间" },
  { prop: "merchantNum", label: "任务金额(元)" },
  { prop: "merchantNum", label: "任务积分" },
  { prop: "merchantName", label: "任务ID", search: { el: "input" } },
  { prop: "contractUserName", label: "任务名称" },
  { prop: "merchantName", label: "交易时间", search: { el: "input" }, isShow: false },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: MerchantStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "contractTelephone", label: "二维码ID" },
  { prop: "contractTelephone", label: "设备编号" },
  { prop: "contractTelephone", label: "商品名称" }
]);
const TableRURef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.memberMerchantType = "company";
  return subMerchantAccountFundQueryListApi(newParams);
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
</script>
