<template>
  <div class="table-box">
    <TablePro ref="TableProRef" :columns="columns" :request-api="query" :data-callback="dataCallback" :pagination="false">
      <template #action="scope">
        <el-button type="primary" link @click="onSet(scope.row)">设置分润</el-button>
      </template>
    </TablePro>
    <split-rule-modal ref="modalRef" :handle-submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { splitRuleAddApi, splitRuleMobileDetailApi, splitRuleMobileSaveApi } from "@/api/modules/inventory";
import { queryProductCategoryTree } from "@/api/modules/business";
import SplitRuleModal from "./components/SplitRuleModal.vue";

const TableProRef = ref<ProTableInstance>();
const modalRef = ref<any>();
const initParam = reactive({
  splitBizType: "mobile",
  bizId: ""
});

const columns = reactive<ColumnProps[]>([
  { prop: "classifyCode", label: "流量套餐分类" },
  { prop: "classifyName", label: "流量套餐分类名称" },
  { prop: "splitRuleId", label: "分润规则ID" },
  { prop: "splitRuleName", label: "分润规则名称" },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const dataCallback = (res: any) => {
  return {
    list: res.data
  };
};
const query = () => {
  return queryProductCategoryTree("mobile", "0");
};
const onSubmit = async (data: Inventory.SplitRuleFormData): Promise<string> => {
  if (data.id) {
    await splitRuleMobileSaveApi({ ...data, ...initParam });
    TableProRef.value?.getTableList();
    return data.id;
  }
  const res = await splitRuleAddApi({ ...data, ...initParam });
  TableProRef.value?.getTableList();
  return res.data.id;
};
const onSet = async (data: BusinessSpace.ProductCategory) => {
  initParam.bizId = data.id!;
  let splitData: Inventory.SplitRule | undefined;
  if (data.splitRuleId) {
    const res = await splitRuleMobileDetailApi({ classifyId: data.id });
    splitData = res.data;
  }
  modalRef.value?.open(splitData);
};
</script>
