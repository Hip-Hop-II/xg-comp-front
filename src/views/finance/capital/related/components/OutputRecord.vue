<template>
  <TablePro
    ref="TableCHURef"
    :columns="ChuColumns"
    :request-api="getTableList"
    :init-param="initParam"
    :data-callback="dataCallback"
    :pagination="false"
  />
</template>

<script setup lang="tsx" name="OutputRecord">
import { useUserStore } from "@/stores/modules/user";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import { subMerchantAccountFundQueryListApi } from "@/api/modules/finance";

const userStore = useUserStore();
const { MerchantStatus, MerchantType } = userStore.dataType;

const initParam = reactive({});
const ChuColumns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "merchantNum", label: "出金编号", search: { el: "input" } },
  { prop: "contractUserName", label: "出金金额" },
  {
    prop: "merchantType",
    label: "出金类型",
    search: { el: "select" },
    enum: MerchantType,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "merchantName", label: "入账方编号", search: { el: "input" } },
  { prop: "merchantName", label: "入账方账户名" },
  { prop: "merchantName", label: "入账方账号" },
  { prop: "statusMsg", label: "说明" },
  { prop: "contractTelephone", label: "发起时间", search: { el: "input" } },
  { prop: "contractTelephone", label: "接口处理成功时间", width: 120 },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: MerchantStatus,
    fieldNames: { label: "value", value: "type" }
  }
]);

const TableCHURef = ref<ProTableInstance>();

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
