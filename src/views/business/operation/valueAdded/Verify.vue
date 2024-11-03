<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="queryGoodsModelList" :data-callback="dataCallback">
      <template #tableHeader>
        <router-link to="/business/operation/value-added/mauth-package">
          <el-button type="primary">查看套餐</el-button>
        </router-link>
        <el-button type="primary" @click="onBuy" class="ml-3">购买套餐</el-button>
      </template>
    </TablePro>
    <purchase ref="purchaseRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { queryGoodsModelList } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate } from "@/utils";
import Purchase from "./Purchase.vue";

const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const purchaseRef = ref<any>();

const columns = reactive<ColumnProps[]>([
  {
    prop: "memberName",
    label: "用户姓名"
  },
  {
    prop: "telephone",
    label: "用户手机号",
    search: { el: "input" }
  },
  {
    prop: "bizType",
    label: "类型",
    enum: userStore.dataType.BizType,
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
    label: "发送时间",
    render(scope) {
      return timestampToDate(scope.row.startTime);
    }
  },
  { prop: "inventoryCount", label: "是否验证", enum: userStore.dataType.YesOrNo, fieldNames: { label: "value", value: "type" } },
  {
    prop: "endTime",
    label: "验证时间",
    render(scope) {
      return timestampToDate(scope.row.endTime);
    }
  },
  {
    prop: "authImg",
    label: "人脸照片",
    render(scope) {
      return h("img", { src: scope.row.authImg, width: 60, height: 60 });
    }
  }
]);

const onBuy = () => {
  purchaseRef.value?.open("mauth", "用户认证");
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
