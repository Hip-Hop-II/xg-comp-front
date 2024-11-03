<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    />
  </div>
</template>

<script setup lang="tsx" name="AccountRecharge">
import { reactive, ref } from "vue";

import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { merchantBankFundBankInputQueryListApi } from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import { timestampToDate, convertFenToYuan } from "@/utils/index";

const userStore = useUserStore();
const { ConsumerStatus } = userStore.dataType;
// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "id", label: "入金单号", search: { el: "input" } },
  {
    prop: "consumerCode",
    label: "入金金额",
    render(scope) {
      return convertFenToYuan(scope.row.consumerCode) || "--";
    }
  },
  {
    prop: "startTime",
    label: "入金时间",
    render(scope) {
      return timestampToDate(scope.row.startTime) || "--";
    }
  },
  { prop: "telephone", label: "入金账号", search: { el: "input" } },
  {
    prop: "consumerName",
    label: "收单机构",
    search: { el: "select" },
    enum: ConsumerStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "telephone", label: "入金说明" },
  { prop: "telephone", label: "公域平台" },
  { prop: "telephone", label: "店铺名称" },
  { prop: "telephone", label: "店铺ID" }
]);

// 如果表格需要初始化请求参数，直接定义传给 TablePro (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
// TablePro 实例
const TableProRef = ref<ProTableInstance>();

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 TablePro 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.id = userStore.userInfo.id;
  return merchantBankFundBankInputQueryListApi(newParams);
};

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
</script>
