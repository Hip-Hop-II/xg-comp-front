<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格操作 -->
      <template #action="scope">
        <el-button type="primary" link @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link @click="openDrawer('处理投诉', scope.row)">处理投诉</el-button>
        <el-button type="primary" link @click="openDrawer('投诉反馈', scope.row)">投诉反馈</el-button>
        <el-button type="primary" link @click="openDrawer('退款', scope.row)">退款</el-button>
      </template>
    </TablePro>

    <WeChatPayDrawer ref="WeChatPayDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="WeChatPay">
import { reactive, ref } from "vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { weChatComplaintApi } from "@/api/modules/business";
import WeChatPayDrawer from "./components/WeChatPayDrawer.vue";
import { timestampToDate } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
import dayjs from "dayjs";

const userStore = useUserStore();
const { BizType } = userStore.dataType;

const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "id", label: "订单编号", search: { el: "input" }, width: 90 },
  { prop: "complaintId", label: "投诉订单号", search: { el: "input" }, width: 110 },
  {
    prop: "complaintTime",
    label: "投诉时间",
    width: 90,
    render(scope) {
      return timestampToDate(scope.row.createTime) || "--";
    }
  },
  { prop: "complaintDetail", label: "投诉详情", width: 90 },
  {
    prop: "complaintState",
    label: "投诉状态",
    search: { el: "select" },
    enum: BizType,
    isShow: false,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "payerPhone", label: "投诉人联系方式", width: 140 },
  { prop: "mchid", label: "微信商户号", width: 110 },
  { prop: "complaintedMchid", label: "被诉商户号", width: 110 },
  { prop: "transactionId", label: "微信订单号", width: 110 },
  { prop: "amount", label: "订单金额", width: 90 },
  {
    prop: "交易时间",
    label: "操作时间",
    width: 90,
    render(scope) {
      return timestampToDate(scope.row.createTime) || "--";
    }
  },
  { prop: "orderId", label: "微信支付服务订单号", width: 150 },
  { prop: "outTradeNo", label: "商户订单号", width: 110 },
  { prop: "outOrderNo", label: "商户服务订单号", width: 120 },
  {
    prop: "outOrderNo",
    label: "下单时间",
    width: 100,
    search: {
      el: "date-picker",
      props: {
        type: "daterange",
        "value-format": "YYYYMMDD"
      }
    },
    isShow: false
  },
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
  { prop: "statusCode", label: "状态" },
  {
    prop: "action",
    label: "操作",
    fixed: "right",
    width: 300
  }
]);

const initParam = reactive({});
const TableProRef = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(
    JSON.stringify({
      ...params,
      startTime: "2024-07-03",
      endTime: "2024-08-01",
      channelType: "wxmp"
    })
  );
  return weChatComplaintApi(newParams);
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

// 打开 drawer(新增、查看、编辑)
const WeChatPayDrawerRef = ref<InstanceType<typeof WeChatPayDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: undefined,
    getTableList: TableProRef.value?.getTableList
  };
  WeChatPayDrawer.value?.acceptParams(params);
};
</script>
