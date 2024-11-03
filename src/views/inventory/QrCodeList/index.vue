<template>
  <div class="h-full">
    <div class="table-box">
      <TablePro
        ref="TableProRef"
        :columns="columns"
        :request-api="onSearch"
        :data-callback="dataCallback"
        :init-param="initParam"
        @selection-change="onSelectionChange"
      >
        <template #tableHeader>
          <el-button type="primary" @click="deviceReturnBackModalRef?.open(selectedRows)" :disabled="selectedRows.length < 1">
            设备退回
          </el-button>
        </template>
        <template #action="scope">
          <el-button type="primary" link @click="onBindSim(scope.row)">绑定SIM卡</el-button>
          <el-button type="primary" link @click="onBindSeller(scope.row)">绑定销售</el-button>
        </template>
      </TablePro>
    </div>
    <device-return-back-modal ref="deviceReturnBackModalRef" @success="onSuccess" />
    <device-bind-seller-modal ref="deviceBindSellerModalRef" @success="onSuccess" />
    <device-bind-sim-modal ref="deviceBindSimModalRef" @success="onSuccess" />
    <device-details-modal ref="deviceDetailsModalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElButton, ElCascader } from "element-plus";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { merchantDevicePageListApi, merchantDeviceSellerListApi } from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";
import DeviceReturnBackModal from "./components/DeviceReturnBackModal.vue";
import DeviceBindSellerModal from "./components/DeviceBindSellerModal.vue";
import DeviceBindSimModal from "./components/DeviceBindSimModal.vue";
import DeviceDetailsModal from "./components/DeviceDetailsModal.vue";
import { queryProductCategoryList } from "@/api/modules/business";

const initParam = reactive<{ deviceClassifyCode?: string }>({});
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const deviceReturnBackModalRef = ref<any>();
const deviceBindSellerModalRef = ref<any>();
const deviceBindSimModalRef = ref<any>();
const deviceDetailsModalRef = ref<any>();
const useStore = useUserStore();
const selectedRows = shallowRef<any[]>([]);
const TableProRef = ref<ProTableInstance>();
const dataSource = ref<BusinessSpace.ProductCategory[]>([]);
const cascaderValues = ref<string[]>([]);
const columns = reactive<ColumnProps[]>([
  { type: "selection" },
  {
    prop: "classifyCode",
    label: "设备分类",
    isShow: false,
    search: {
      render() {
        return h(ElCascader, {
          options: dataSource.value,
          placeholder: "请选择设备分类",
          modelValue: cascaderValues.value,
          "onUpdate:modelValue": val => {
            const _val = val as string[];
            cascaderValues.value = _val;
            initParam.deviceClassifyCode = _val[_val.length - 1];
          },
          props: {
            expandTrigger: "hover",
            value: "classifyCode",
            label: "classifyName",
            children: "respList"
          }
        });
      }
    }
  },
  { prop: "deviceCode", label: "设备编号", width: 150, search: { el: "input", props: { placeholder: "请输入设备编号" } } },
  { prop: "deviceName", label: "设备名称", width: 150 },
  { prop: "bindUserName", label: "绑定用户", width: 150 },
  {
    prop: "deviceModel",
    label: "设备型号",
    width: 150
    // render: scope => {
    //   return h(
    //     "a",
    //     {
    //       style: {
    //         color: "#409EFF",
    //         cursor: "pointer"
    //       },
    //       onClick: async () => {
    //         await merchantDeviceDetailApi(scope.row.id);
    //         // deviceDetailsModalRef.value?.open(res.data);
    //       }
    //     },
    //     scope.row.deviceModel
    //   );
    // }
  },
  { prop: "manufacturer", label: "生产商", width: 150 },
  {
    prop: "telecom",
    label: "运营商",
    width: 150,
    enum: useStore.dataType.Telcom,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select" }
  },
  {
    prop: "telecomCardTelephone",
    label: "SIM卡手机号",
    search: { el: "input", props: { placeholder: "请输入手机号" } },
    width: 150
  },
  { prop: "telecomCardIccid", label: "SIM卡ICCID", width: 150 },
  { prop: "sellUserName", label: "销售人员", width: 150 },
  { prop: "sellPrice", label: "销售价格", width: 150 },
  { prop: "sellMerchantPrice", label: "代理价格", width: 150 },
  {
    prop: "statusCode",
    label: "状态",
    enum: useStore.dataType.DeviceStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select" },
    width: 150
  },
  { prop: "statusMsg", label: "说明", width: 150 },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const onSearch = (params: any) => {
  TableProRef.value?.clearSelection();
  return merchantDevicePageListApi(params);
};
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
const onBindSim = (data: any) => {
  deviceBindSimModalRef.value?.open(data);
};
const onBindSeller = async (data: any) => {
  const res = await merchantDeviceSellerListApi();
  deviceBindSellerModalRef.value?.open(data, res.data);
};
const onSelectionChange = (data: any[]) => {
  selectedRows.value = data;
};

onMounted(() => {
  queryProductCategoryList("device").then(res => {
    dataSource.value = res;
  });
});
</script>

<style lang="scss">
.device-code-tree-node {
  .el-tree-node__content {
    height: auto;
    padding: 0;
  }
}
</style>
