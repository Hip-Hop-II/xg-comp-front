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
          <slot :selected-rows="selectedRows" :get-search-params="getSearchParams" />
        </template>
        <template #action="scope">
          <el-button type="primary" link @click="onEdit(scope.row)">编辑</el-button>
        </template>
      </TablePro>
    </div>
    <device-qr-modal ref="modalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, shallowRef } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { merchantDeviceImportPageListApi } from "@/api/modules/inventory";
import DeviceQrModal from "./DeviceQrModal.vue";
import { timestampToDate } from "@/utils";
import { ElCascader } from "element-plus";
import { queryProductCategoryList } from "@/api/modules/business";

const props = defineProps<{
  statusCodes: { type: string; value: string }[];
  defaultStatusCode?: string;
  manufacturerMerchants: { merchantName: string; merchantNum: string }[];
  showSelection?: boolean;
}>();

const emit = defineEmits<{
  onSearch: [data: any];
}>();

const initParam = reactive<{ classifyCode?: string }>({});
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum || 1,
    pageSize: res.pageSize || 10
  };
};
const modalRef = ref<any>();
const dataSource = ref<BusinessSpace.ProductCategory[]>([]);
const selectedRows = shallowRef<any[]>([]);
const TableProRef = ref<ProTableInstance>();
const cascaderValues = ref<string[]>([]);
const columns = reactive<ColumnProps[]>([
  props.showSelection
    ? {
        type: "selection"
      }
    : {
        type: "index",
        label: "序号",
        width: 60
      },
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
            initParam.classifyCode = _val[_val.length - 1];
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
  {
    prop: "fileName",
    label: "导入文件名称",
    search: { el: "input", props: { placeholder: "请输入文件名称" } },
    width: 150
  },
  {
    prop: "importTime",
    label: "导入时间",
    render: scope => {
      return timestampToDate(scope.row.importTime) || "";
    },
    search: {
      el: "date-picker",
      props: {
        placeholder: "请选择导入时间",
        disabledDate: (time: Date) => {
          return time.getTime() > Date.now();
        }
      }
    },
    width: 180
  },
  { prop: "deviceCode", label: "设备编号", search: { el: "input", props: { placeholder: "请输入设备编号" } }, width: 120 },
  { prop: "deviceName", label: "设备名称", width: 120 },
  { prop: "deviceModel", label: "设备型号", width: 120 },
  { prop: "deviceBrand", label: "品牌名称", width: 120 },
  {
    prop: "manufacturer",
    label: "生产商",
    isShow: false,
    enum: props.manufacturerMerchants,
    fieldNames: { label: "merchantName", value: "merchantNum" },
    search: { el: "select" },
    width: 120
  },
  { prop: "manufacturerMerchantName", label: "生产商", width: 160 },
  {
    prop: "statusCode",
    label: "状态",
    enum: props.statusCodes,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", defaultValue: props.defaultStatusCode },
    width: 120
  },
  { prop: "statusMsg", label: "说明" },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const onSearch = (params: any) => {
  if (params?.importTime) {
    params.importTime = params.importTime.getTime();
  }
  emit("onSearch", params);
  TableProRef.value?.clearSelection();
  return merchantDeviceImportPageListApi(params);
};
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
const onSelectionChange = (data: any[]) => {
  selectedRows.value = data;
};
const onEdit = (data: Inventory.DeviceCodeListItem) => {
  modalRef.value?.open(data, props.manufacturerMerchants, props.statusCodes);
};
const getSearchParams = () => {
  return TableProRef.value?.searchParam;
};
defineExpose({
  query: onSuccess,
  clearSelection() {
    TableProRef.value?.clearSelection();
  }
});
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
