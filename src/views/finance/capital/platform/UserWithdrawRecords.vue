<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="consumerWithdrawQueryListApi"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #action="scope">
        <el-button type="primary" link @click="openDrawer(scope.row.id)">审核</el-button>
      </template>
    </TablePro>
    <user-withdraw-drawer ref="drawerRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import UserWithdrawDrawer from "./components/UserWithdrawDrawer.vue";
import { useUserStore } from "@/stores/modules/user";
import { consumerWithdrawQueryListApi } from "@/api/modules/finance";
import { convertFenToYuan, timestampToDate } from "@/utils";
import { ElOption, ElSelect } from "element-plus";
import useEnumsStore from "@/stores/modules/enums";

const userStore = useUserStore();
const enumStore = useEnumsStore();
const { FundOrderStatus, AccountType } = userStore.dataType;
const options = ref<any>([]);
const initParam = reactive({
  statusCode: "approve",
  bankNum: "",
  bankName: ""
});
const TableProRef = ref<ProTableInstance>();
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "orderCode", label: "提现单号", search: { el: "input" }, width: 240 },
  {
    prop: "consumerCode",
    label: "用户编号",
    width: 160
  },
  { prop: "consumerName", label: "用户名称", width: 160 },
  { prop: "accountType", label: "出账账户类型", enum: AccountType, fieldNames: { label: "value", value: "type" }, width: 160 },
  { prop: "outMerchantNo", label: "支付公司商户号", width: 240 },
  {
    prop: "bankName",
    label: "到账银行名称",
    search: {
      render() {
        return h(
          ElSelect,
          {
            placeholder: "请选择到账银行名称",
            modelValue: initParam.bankNum,
            "onUpdate:modelValue": val => {
              initParam.bankNum = val;
              initParam.bankName = enumStore.bankListComps.filter(option => option.bankNum === val)[0]?.bankName || "";
            },
            filterable: true,
            remote: true,
            remoteMethod: (query: string) => {
              if (query) {
                options.value = enumStore.bankListComps.filter(option => option.bankName.includes(query));
              } else {
                options.value = [];
              }
            }
          },
          () => options.value.map(option => h(ElOption, { label: option.bankName, value: option.bankNum }))
        );
      }
    },
    width: 160
  },
  { prop: "bankCardNumber", label: "到账银行卡号", width: 180 },
  { prop: "bankAccountName", label: "到账银行卡名称", width: 160 },
  {
    prop: "money",
    label: "提现金额(元)",
    render(scope) {
      return convertFenToYuan(scope.row.money) || "--";
    },
    width: 160
  },
  { prop: "remark", label: "提现说明", width: 160 },
  {
    prop: "startTime",
    label: "发起时间",
    render(scope) {
      return timestampToDate(scope.row.startTime) || "--";
    },
    width: 240
  },
  {
    prop: "endTime",
    label: "完成时间",
    render(scope) {
      return timestampToDate(scope.row.endTime) || "--";
    },
    width: 240
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: FundOrderStatus,
    fieldNames: { label: "value", value: "type" },
    width: 150
  },
  { prop: "statusMsg", label: "状态说明", width: 160 },
  { prop: "action", label: "操作", fixed: "right", width: 150 }
]);

const onSuccess = () => {
  TableProRef.value?.getTableList();
};

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const drawerRef = ref<any>(null);

const openDrawer = (id: string) => {
  drawerRef.value?.open(id);
};
</script>
