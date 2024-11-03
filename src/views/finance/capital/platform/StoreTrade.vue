<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    />
  </div>
</template>

<script setup lang="tsx" name="AccountWithdrawal">
import { reactive, ref } from "vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { merchantShopPoQueryListApi } from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import { convertFenToYuan } from "@/utils";
import dayjs from "dayjs";

const userStore = useUserStore();
const { Shop, ShopStatus } = userStore.dataType;

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  {
    prop: "yyyyMM",
    label: "交易月份",
    search: {
      el: "date-picker",
      props: {
        type: "month",
        "value-format": "YYYYMM"
      },
      defaultValue: dayjs(Date.now()).format("YYYYMM")
    },
    isShow: false
  },
  {
    prop: "sourceType",
    label: "店铺类型",
    search: { el: "select" },
    enum: Shop,
    fieldNames: { label: "value", value: "type" },
    width: 100
  },
  { prop: "platformShopNo", label: "店铺编号", width: 100, search: { el: "input" } },
  { prop: "shopName", label: "店铺名称", width: 100 },
  { prop: "shopPoNum", label: "店铺订单编号", width: 130, search: { el: "input" } },
  { prop: "qrId", label: "二维码ID", width: 100 },
  { prop: "deviceCode", label: "设备编号", width: 100 },
  { prop: "consumerCode", label: "设备名称", width: 100 },
  { prop: "consumerCode", label: "销售价格", width: 100 },
  {
    prop: "consumerCode",
    label: "支付金额",
    width: 100,
    render(scope) {
      return convertFenToYuan(scope.row.consumerCode) || "--";
    }
  },
  {
    prop: "statusCode",
    label: "订单状态",
    search: { el: "select" },
    enum: ShopStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "riskRule", label: "下单时间", width: 100 },
  { prop: "riskRule", label: "支付完成时间", width: 140 }
]);

const initParam = reactive({});
const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return merchantShopPoQueryListApi(newParams);
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
