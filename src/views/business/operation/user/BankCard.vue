<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="queryGoodsModelList" :data-callback="dataCallback" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { queryGoodsModelList } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();

const columns = reactive<ColumnProps[]>([
  {
    prop: "goodsNum",
    label: "用户编号",
    search: { el: "input" }
  },
  {
    prop: "goodsName",
    label: "用户姓名"
  },
  {
    prop: "goodsModel",
    label: "用户手机号",
    search: { el: "input" }
  },
  { prop: "inventoryLowNum", label: "银行名称" },
  { prop: "inventoryCount", label: "银行卡号", search: { el: "input" } },
  { prop: "inventoryLowNum", label: "支行名称" },
  { prop: "inventoryLowNum", label: "开户名" },
  { prop: "inventoryLowNum", label: "绑卡手机号" },
  { prop: "inventoryLowNum", label: "卡类型" },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.BaseStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择状态" } }
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
</script>
