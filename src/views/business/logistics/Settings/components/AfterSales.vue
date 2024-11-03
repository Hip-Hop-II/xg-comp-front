<template>
  <div class="mb-2">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="queryReturnAddress"
      :height="200"
      :max-height="400"
      :data-callback="dataCallback"
    >
      <template #tableHeader>
        <el-button type="primary" @click="onCreate">新增退货地址</el-button>
      </template>
      <template #action="scope">
        <el-button type="primary" link @click="onEdit(scope.row)">编辑</el-button>
      </template>
    </TablePro>
    <after-sales-modal ref="afterSalesModalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { queryReturnAddress } from "@/api/modules/business";
import AfterSalesModal from "./AfterSalesModal.vue";
import useEnumsStore from "@/stores/modules/enums";
import { useUserStore } from "@/stores/modules/user";

const enumsStore = useEnumsStore();
const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const afterSalesModalRef = ref<any>();

const columns = reactive<ColumnProps[]>([
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
  { prop: "receiveAddress", label: "详细地址" },
  { prop: "receiveUserName", label: "收件人" },
  { prop: "receiveUserTel", label: "电话" },
  {
    prop: "isDefault",
    label: "是否默认",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" }
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.BaseStatus,
    fieldNames: { label: "value", value: "type" }
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
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
const onCreate = () => {
  afterSalesModalRef.value?.open();
};
const onEdit = (data: BusinessSpace.AfterSaleAddressForm) => {
  afterSalesModalRef.value?.open(data);
};
</script>
