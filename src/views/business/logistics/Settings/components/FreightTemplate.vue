<template>
  <div class="mb-2">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="queryFreightTemplate"
      :height="200"
      :max-height="400"
      :data-callback="dataCallback"
    >
      <template #tableHeader="">
        <el-button type="primary" @click="onCreate">新增运费模版</el-button>
      </template>
      <template #action="scope">
        <el-button type="primary" link @click="onEdit(scope.row)">编辑</el-button>
      </template>
    </TablePro>
    <freight-template-modal ref="freightTemplateModalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { queryFreightTemplate } from "@/api/modules/business";
import FreightTemplateModal from "./FreightTemplateModal.vue";
import useEnumsStore from "@/stores/modules/enums";

const enumsStore = useEnumsStore();
const TableProRef = ref<ProTableInstance>();
const freightTemplateModalRef = ref<any>();

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
    render: scope => {
      return scope.row.isDefault === 1 ? "是" : "否";
    }
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
  freightTemplateModalRef.value?.open();
};
const onEdit = (data: any) => {
  console.log(data);
};
</script>
