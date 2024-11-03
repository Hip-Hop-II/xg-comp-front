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
import { merchantBankFundBankOutputQueryListApi } from "@/api/modules/finance";
import { useUserStore } from "@/stores/modules/user";
import { convertFenToYuan } from "@/utils/index";
import dayjs from "dayjs";

const userStore = useUserStore();
const { ConsumerStatus } = userStore.dataType;
// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "id", label: "会员编号", search: { el: "input" } },
  { prop: "id", label: "出金单编号", search: { el: "input" }, width: 120 },
  {
    prop: "consumerCode",
    label: "出金金额",
    render(scope) {
      return convertFenToYuan(scope.row.consumerCode) || "--";
    }
  },
  { prop: "consumerName", label: "收单机构" },
  { prop: "consumerName", label: "银行名称" },
  { prop: "consumerName", label: "银行VB账号", width: 120 },
  { prop: "consumerName", label: "手机号", search: { el: "input" } },
  { prop: "consumerName", label: "入账方" },
  { prop: "consumerName", label: "入账商户编号", width: 120 },
  { prop: "consumerName", label: "说明" },
  { prop: "consumerName", label: "发起时间" },
  { prop: "consumerName", label: "处理成功时间", width: 120 },
  {
    prop: "yyyy",
    label: "所属年份",
    search: {
      el: "date-picker",
      props: {
        type: "year",
        "value-format": "YYYY"
      },
      defaultValue: dayjs(Date.now()).format("YYYY")
    },
    isShow: false
  },
  {
    prop: "consumerName",
    label: "状态",
    search: { el: "select" },
    enum: ConsumerStatus,
    fieldNames: { label: "value", value: "type" }
  }
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
  return merchantBankFundBankOutputQueryListApi(newParams);
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
