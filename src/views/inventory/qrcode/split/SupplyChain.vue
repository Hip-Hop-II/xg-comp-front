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
          :style="`color: ${data.classifyCode === initParam.classifyCode ? '#009688' : '#606266'}`"
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
        :request-api="queryGoodsPageList"
        :data-callback="dataCallback"
        :init-param="initParam"
      >
        <template #action="scope">
          <router-link to=""><el-button type="primary" link>手机预览</el-button></router-link>
          <el-button type="primary" link @click="onEdit(scope.row)">设置分润</el-button>
        </template>
      </TablePro>
    </div>
    <split-rule-modal ref="modalRef" :handle-submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, shallowRef } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { splitRuleGoodsDetailApi, splitRuleGoodsSaveApi } from "@/api/modules/inventory";
import { getSupplyListApi, queryProductCategoryTree, queryGoodsPageList } from "@/api/modules/business";
import SplitRuleModal from "./components/SplitRuleModal.vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const initParam = reactive({
  classifyCode: "",
  splitBizType: "goods",
  statusCode: "success",
  supplyNum: "",
  bizId: ""
});
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
const modalRef = ref<any>();
const suppliers = shallowRef<Inventory.ManufacturerMerchants[]>([]);
const TableProRef = ref<ProTableInstance>();
const dataSource = ref<BusinessSpace.ProductCategory[]>([]);
const columns = reactive<ColumnProps[]>([
  {
    prop: "supplyNum",
    label: "供应商",
    isShow: false,
    search: { el: "select" },
    enum: suppliers.value,
    fieldNames: { label: "merchantName", value: "merchantNum" }
  },
  {
    prop: "id",
    label: "商品编号",
    search: { el: "input" }
  },
  {
    prop: "goodsName",
    label: "商品名称",
    search: { el: "input" }
  },
  {
    prop: "goodsPrice",
    label: "商品售价"
  },
  {
    prop: "sellStatus",
    label: "是否上架",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const onNodeClick = async (data?: BusinessSpace.ProductCategory) => {
  if (data) {
    if (!data.respList) {
      const res = await queryProductCategoryTree("goods", data.classifyCode);
      data.respList = res.data || [];
      if (!res.data) {
        initParam.classifyCode = data.classifyCode;
      }
    } else if (data.respList.length === 0) {
      initParam.classifyCode = data.classifyCode;
    }
  } else if (!data) {
    const res = await queryProductCategoryTree("goods", "0");
    dataSource.value = res.data;
  }
};
const onSubmit = async (data: Inventory.SplitRuleFormData): Promise<string> => {
  const res = await splitRuleGoodsSaveApi({ ...data, ...initParam });
  TableProRef.value?.getTableList();
  return res.data.id;
};
const onEdit = async (data: BusinessSpace.GoodsItem) => {
  initParam.bizId = data.id;
  let splitData: Inventory.SplitRule | undefined;
  if (data.splitRuleId) {
    const res = await splitRuleGoodsDetailApi({ goodsId: data.id });
    splitData = res.data;
  }
  modalRef.value?.open(splitData);
};
onMounted(() => {
  onNodeClick();
  getSupplyListApi().then(res => {
    suppliers.value = res.data;
  });
});
</script>
