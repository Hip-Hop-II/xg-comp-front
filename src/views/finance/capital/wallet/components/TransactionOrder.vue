<template>
  <TablePro
    ref="TableOrderRef"
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
import { merchantShopPoListApi } from "@/api/modules/finance";

const userStore = useUserStore();
const { MerchantStatus } = userStore.dataType;

const initParam = reactive({});
const Columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "merchantNum", label: "订单编号", search: { el: "input" }, width: 100 },
  { prop: "merchantNum", label: "子订单号", search: { el: "input" }, width: 100 },
  { prop: "merchantNum", label: "商品编号", width: 100 },
  { prop: "merchantNum", label: "商品名称", width: 100 },
  { prop: "merchantNum", label: "积分账户支付金额", width: 150 },
  { prop: "merchantNum", label: "现金账户支付金额", width: 150 },
  { prop: "merchantName", label: "支付金额", width: 100 },
  { prop: "contractUserName", label: "支付方式", width: 100 },
  { prop: "merchantName", label: "交易时间", search: { el: "input" }, isShow: false },
  {
    prop: "statusCode",
    label: "订单状态",
    search: { el: "select" },
    enum: MerchantStatus,
    fieldNames: { label: "value", value: "type" },
    width: 100
  },
  {
    prop: "month",
    label: "交易月份",
    search: { el: "select", defaultValue: 202406 },
    enum: [
      { value: 202406, type: 202406 },
      { value: 202405, type: 202405 }
    ],
    fieldNames: { label: "value", value: "type" },
    isShow: false
  },
  { prop: "contractTelephone", label: "交易单号(微信/支付宝)", search: { el: "input" }, width: 180 },
  { prop: "contractTelephone", label: "下单时间", search: { el: "input" }, width: 100 },
  { prop: "contractTelephone", label: "代理商" },
  { prop: "contractTelephone", label: "销售人员", width: 100 }
]);
const TableOrderRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return merchantShopPoListApi(newParams);
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
