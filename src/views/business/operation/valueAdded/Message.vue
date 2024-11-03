<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="telephoneMsgPageListApi" :data-callback="dataCallback">
      <template #tableHeader>
        <router-link to="/business/operation/value-added/sms-package">
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
import { telephoneMsgPageListApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate } from "@/utils";
import Purchase from "./Purchase.vue";

const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const purchaseRef = ref<any>();
const columns = reactive<ColumnProps[]>([
  {
    prop: "name",
    label: "用户姓名"
  },
  {
    prop: "telephone",
    label: "用户手机号",
    search: { el: "input" }
  },
  {
    prop: "bizType",
    label: "业务类型",
    enum: userStore.dataType.BizType,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择业务类型" } }
  },
  {
    prop: "smsCode",
    label: "短信模版"
  },
  {
    prop: "sendStatus",
    label: "是否发送",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择是否发送" } }
  },
  { prop: "settleStatus", label: "是否结算", enum: userStore.dataType.YesOrNo, fieldNames: { label: "value", value: "type" } },
  {
    prop: "settlePrice",
    label: "结算价格",
    render(scope) {
      return (scope.row.settlePrice / 100).toFixed(2) + "元";
    }
  },
  {
    prop: "sendTime",
    label: "发送时间",
    render(scope) {
      return timestampToDate(scope.row.sendTime) || "";
    }
  }
]);

const onBuy = () => {
  purchaseRef.value?.open("sms", "短信服务套餐");
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
