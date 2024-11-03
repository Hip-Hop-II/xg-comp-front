<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="platformPackagePoPageListApi"
      :data-callback="dataCallback"
      :init-param="initParam"
      :pagination="false"
    >
      <template #tableHeader>
        <el-button type="primary" @click="onBuy">购买套餐</el-button>
      </template>
    </TablePro>
    <purchase ref="purchaseRef" />
  </div>
</template>

<script setup lang="ts">
import { ColumnProps, ProTableInstance } from "@/components/TablePro/interface";
import { ref, reactive } from "vue";
import { platformPackagePoPageListApi } from "@/api/modules/business";
import { timestampToDate } from "@/utils";
import Purchase from "./Purchase.vue";

const props = defineProps<{
  packageType: string;
  title?: string;
}>();

const purchaseRef = ref<any>();
const initParam = reactive({
  packageType: props.packageType,
  startPage: false
});

const TableProRef = ref<ProTableInstance>();
const visible = ref(false);
const columns = reactive<ColumnProps[]>([
  {
    prop: "packageName",
    label: "产品名称"
  },
  {
    prop: "quantity",
    label: "套餐数量"
  },
  {
    prop: "useQuantity",
    label: "使用数量"
  },
  {
    prop: "validityEndTime",
    label: "有效期结束",
    render(scope) {
      return timestampToDate(scope.row.validityEndTime);
    },
    width: 180
  },
  {
    prop: "serviceTel",
    label: "服务电话"
  },
  {
    prop: "companyName",
    label: "服务商"
  },
  {
    prop: "packageDesc",
    label: "产品说明"
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
  purchaseRef.value?.open(props.packageType, props.title);
};

defineExpose({
  open() {
    visible.value = true;
  }
});
</script>
