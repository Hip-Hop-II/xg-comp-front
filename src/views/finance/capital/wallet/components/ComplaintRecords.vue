<template>
  <TablePro
    ref="TableRef"
    :columns="Columns"
    :request-api="getTableList"
    :init-param="initParam"
    :data-callback="dataCallback"
    :pagination="false"
  />
</template>

<script setup lang="tsx" name="TransactionOrder">
import { useUserStore } from "@/stores/modules/user";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import { subMerchantAccountFundQueryListApi } from "@/api/modules/finance";

const userStore = useUserStore();
const { MerchantStatus } = userStore.dataType;

const initParam = reactive({});
const Columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  {
    prop: "statusCode",
    label: "收单机构",
    search: { el: "select" },
    enum: MerchantStatus,
    fieldNames: { label: "value", value: "type" },
    isShow: false
  },
  { prop: "merchantNum", label: "投诉订单号", search: { el: "input" }, width: 100 },
  { prop: "merchantNum", label: "投诉时间", width: 100 },
  { prop: "merchantNum", label: "投诉详情", width: 100 },
  {
    prop: "statusCode",
    label: "投诉状态",
    search: { el: "select" },
    enum: MerchantStatus,
    fieldNames: { label: "value", value: "type" },
    width: 100
  },
  { prop: "merchantNum", label: "投诉人ID", search: { el: "input" }, width: 100 },
  { prop: "merchantNum", label: "投诉人联系方式", width: 150 },
  { prop: "merchantNum", label: "微信商户号", width: 150 },
  { prop: "merchantNum", label: "微信订单号", width: 150 },
  { prop: "merchantNum", label: "订单编号", search: { el: "input" }, width: 100 },
  { prop: "merchantName", label: "商户编号", width: 100 },
  { prop: "contractUserName", label: "订单金额", width: 100 },
  { prop: "contractUserName", label: "交易单号", width: 100, isShow: false },
  { prop: "merchantName", label: "交易时间", search: { el: "input" }, width: 100 },
  {
    prop: "yyyyMM",
    label: "交易月份",
    search: { el: "select", defaultValue: 202406 },
    enum: [
      { value: 202406, type: 202406 },
      { value: 202405, type: 202405 }
    ],
    fieldNames: { label: "value", value: "type" },
    isShow: false
  },
  { prop: "contractTelephone", label: "图片" },
  { prop: "contractTelephone", label: "下单时间", search: { el: "input" }, width: 100 },
  { prop: "contractTelephone", label: "商品编号", width: 100 },
  { prop: "contractTelephone", label: "商品名称", width: 100 },
  { prop: "contractTelephone", label: "代理商" },
  { prop: "contractTelephone", label: "销售人员", width: 100 }
]);
const TableRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
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
