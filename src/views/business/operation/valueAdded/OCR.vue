<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="ocrRecordPageListApi" :data-callback="dataCallback">
      <template #tableHeader>
        <router-link to="/business/operation/value-added/ocr-package">
          <el-button type="primary">查看套餐</el-button>
        </router-link>
        <el-button type="primary" @click="onBuy" class="ml-3">购买套餐</el-button>
      </template>
    </TablePro>
    <purchase ref="purchaseRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { ocrRecordPageListApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate } from "@/utils";
import Purchase from "./Purchase.vue";

const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const purchaseRef = ref<any>();
const columns = reactive<ColumnProps[]>([
  {
    prop: "memberName",
    label: "名称"
  },
  {
    prop: "fileType",
    label: "类型",
    enum: userStore.dataType.MerchantFileType,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择类型" } }
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.BaseStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  {
    prop: "startTime",
    label: "识别时间",
    render(scope) {
      return timestampToDate(scope.row.startTime);
    }
  },
  { prop: "content", label: "识别内容" },
  {
    prop: "settleStatus",
    label: "是否结算",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" }
  },
  {
    prop: "settlePrice",
    label: "结算价格",
    render(scope) {
      return (scope.row.settlePrice / 100).toFixed(2) + "元";
    }
  }
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
  purchaseRef.value?.open("ocr", "证照识别套餐");
};
</script>
