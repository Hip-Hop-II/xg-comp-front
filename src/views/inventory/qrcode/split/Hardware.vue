<template>
  <div class="relative h-full">
    <el-tree
      class="w-60 absolute top-0 left-0 h-full overflow-auto rounded-md"
      :data="dataSource"
      node-key="id"
      default-expand-all
      :props="{ label: 'classifyName', children: 'respList', class: () => 'device-code-tree-node' }"
    >
      <template #default="{ node, data }">
        <div
          class="py-2 w-full"
          :style="`color: ${data.id === initParam.bizId ? '#009688' : '#606266'}`"
          @click="onNodeClick(data)"
        >
          {{ node.label }}
        </div>
      </template>
    </el-tree>
    <div class="table-box pl-65 box-border">
      <TablePro
        ref="TableProRef"
        :columns="columns"
        :request-api="onSearch"
        :request-auto="false"
        :data-callback="dataCallback"
        :init-param="initParam"
        :pagination="false"
      >
        <template #tableHeader>
          <el-button type="primary" @click="onCreate" v-if="!hasSplits">新增分润规则</el-button>
        </template>
        <template #action="scope">
          <el-button type="primary" link @click="onEdit(scope.row)">编辑</el-button>
        </template>
      </TablePro>
    </div>
    <split-rule-modal ref="modalRef" :handle-submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { splitRuleAddApi, splitRulePageListApi, splitRuleUpdateApi } from "@/api/modules/inventory";
import { queryProductCategoryTree } from "@/api/modules/business";
import { timestampToDate } from "@/utils";
import SplitRuleModal from "./components/SplitRuleModal.vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const initParam = reactive({
  splitRuleId: "",
  startPage: false,
  bizId: "",
  classifyCode: "",
  splitBizType: "device"
});
const hasSplits = ref(false);
const dataCallback = (res: any) => {
  const list = res.data || [];
  hasSplits.value = list.length > 0;
  return {
    list,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
const modalRef = ref<any>();
const TableProRef = ref<ProTableInstance>();
const dataSource = ref<BusinessSpace.ProductCategory[]>([]);
const currentLeaf = ref<BusinessSpace.ProductCategory>();
const columns = reactive<ColumnProps[]>([
  {
    prop: "ruleName",
    label: "规则名称"
  },
  {
    prop: "startTime",
    label: "开始时间",
    render: scope => {
      return timestampToDate(scope.row.startTime) || "";
    }
  },
  {
    prop: "endTime",
    label: "结束时间",
    render: scope => {
      return timestampToDate(scope.row.endTime) || "";
    }
  },
  { prop: "remark", label: "规则简述" },
  { prop: "autoSettleDay", label: "自动结算天数" },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.BaseStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const onNodeClick = async (data?: BusinessSpace.ProductCategory) => {
  if (data) {
    currentLeaf.value = data;
    if (!data.respList) {
      const res = await queryProductCategoryTree("device", data.classifyCode);
      data.respList = res.data || [];
      if (!res.data) {
        initParam.bizId = data.id!;
        initParam.classifyCode = data.classifyCode;
        initParam.splitRuleId = data.splitRuleId || "";
        TableProRef.value?.getTableList();
      }
    } else if (data.respList.length === 0) {
      initParam.bizId = data.id!;
      initParam.classifyCode = data.classifyCode;
      initParam.splitRuleId = data.splitRuleId || "";
      TableProRef.value?.getTableList();
    }
  } else if (!data) {
    const res = await queryProductCategoryTree("device", "0");
    dataSource.value = res.data;
  }
};
const onSearch = (params: any) => {
  if (initParam.bizId) {
    return splitRulePageListApi(params);
  }
  ElMessage.error("请选择左侧设备分类");
  return Promise.reject();
};
const resetSplitRuleId = (id: string) => {
  initParam.splitRuleId = id;
  currentLeaf.value!.splitRuleId = id;
};
const onSubmit = async (data: Inventory.SplitRuleFormData): Promise<string> => {
  if (data.id) {
    await splitRuleUpdateApi({ ...data, ...initParam });
    resetSplitRuleId(data.id);
    TableProRef.value?.getTableList();
    return data.id;
  }
  const res = await splitRuleAddApi({ ...data, ...initParam });
  resetSplitRuleId(res.data.id);
  TableProRef.value?.getTableList();
  return res.data.id;
};
const onCreate = () => {
  if (initParam.bizId) {
    return modalRef.value?.open();
  }
  ElMessage.error("请选择左侧设备分类");
};
const onEdit = (data: Inventory.SplitRule) => {
  modalRef.value?.open(data);
};
onMounted(() => {
  onNodeClick();
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
