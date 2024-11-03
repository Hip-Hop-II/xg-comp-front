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
  { prop: "merchantNum", label: "入金编号", search: { el: "input" } },
  { prop: "merchantName", label: "交易时间", search: { el: "input" } },
  {
    prop: "merchantType",
    label: "入金类型",
    search: { el: "select" },
    enum: MerchantType,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "contractUserName", label: "销售金额" },
  { prop: "contractTelephone", label: "分润模式" },
  { prop: "contractTelephone", label: "分润费率" },
  { prop: "contractTelephone", label: "分润金额" },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: MerchantStatus,
    fieldNames: { label: "value", value: "type" }
  },
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
