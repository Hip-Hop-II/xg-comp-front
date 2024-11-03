<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="electronicSignPageListApi" :data-callback="dataCallback">
      <template #tableHeader>
        <router-link to="/business/operation/value-added/esign-package">
          <el-button type="primary">查看套餐</el-button>
        </router-link>
        <el-button type="primary" @click="onBuy" class="ml-3">购买套餐</el-button>
      </template>
      <template #action="scope">
        <a :href="scope.row.signUrl" target="_blank">
          <el-button type="primary" link>查看内容</el-button>
        </a>
        <el-button type="primary" link @click="onCancel(scope.row)" v-if="scope.row.statusCode === 'disable'">
          取消签约
        </el-button>
      </template>
    </TablePro>
    <purchase ref="purchaseRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { electronicSignPageListApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate } from "@/utils";
import Purchase from "./Purchase.vue";

const purchaseRef = ref<any>();
const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const columns = reactive<ColumnProps[]>([
  {
    prop: "orderCode",
    label: "签约单据编号",
    width: 220
  },
  {
    prop: "memberName",
    label: "签约人",
    width: 120
  },
  {
    prop: "telephone",
    label: "电话",
    width: 150,
    search: { el: "input", props: { placeholder: "请输入电话" } }
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.BaseStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择状态" } },
    width: 120
  },
  {
    prop: "settleStatus",
    label: "是否结算",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" },
    width: 120
  },
  {
    prop: "settlePrice",
    label: "结算价格",
    render(scope) {
      return (scope.row.settlePrice / 100).toFixed(2) + "元";
    },
    width: 120
  },
  {
    prop: "startTime",
    label: "发起签约时间",
    render(scope) {
      return timestampToDate(scope.row.startTime) || "";
    },
    width: 180
  },
  {
    prop: "endTime",
    label: "签约完成后时间",
    render(scope) {
      return timestampToDate(scope.row.endTime) || "";
    },
    width: 180
  },
  {
    prop: "bizType",
    label: "业务类型",
    enum: userStore.dataType.BizType,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择业务类型" } }
  },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const onBuy = () => {
  purchaseRef.value?.open("esig", "电子签约套餐");
};
const onCancel = (row: any) => {
  console.log(row);
};
</script>
