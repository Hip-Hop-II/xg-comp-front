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
import useEnumsStore from "@/stores/modules/enums";

const enumsStore = useEnumsStore();
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
  {
    prop: "receiveProvince",
    label: "省",
    render: scope => {
      return enumsStore.getProvinceName(scope.row.receiveProvince);
    }
  },
  {
    prop: "receiveCity",
    label: "市",
    render: scope => {
      return enumsStore.getCityName(scope.row.receiveProvince, scope.row.receiveCity);
    }
  },
  {
    prop: "receiveArea",
    label: "区/县",
    render: scope => {
      return enumsStore.getCountyName(scope.row.receiveProvince, scope.row.receiveCity, scope.row.receiveArea);
    }
  },
  { prop: "address", label: "地址" },
  {
    prop: "isDefault",
    label: "默认",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" }
  },
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
