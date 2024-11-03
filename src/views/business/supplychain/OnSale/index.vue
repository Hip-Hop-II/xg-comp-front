<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="queryGoodsPageList"
      :data-callback="dataCallback"
      :init-param="initParam"
    >
      <template #tableHeader>
        <router-link to="/business/supplychain/product-add">
          <el-button type="primary">新增商品</el-button>
        </router-link>
      </template>
      <template #action="scope">
        <el-button type="primary" link @click="onEdit(scope.row)">下架</el-button>
      </template>
    </TablePro>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { queryGoodsPageList, queryProductCategoryList } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import { ElCascader } from "element-plus";

const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const cascaderValues = ref<string[]>([]);
const dataSource = ref<BusinessSpace.ProductCategory[]>([]);
const initParam = reactive({
  sellStatus: 1,
  classifyId: "",
  classifyCode: ""
});
const columns = reactive<ColumnProps[]>([
  {
    prop: "classifyId",
    label: "商品分类",
    isShow: false,
    search: {
      render() {
        return h(ElCascader, {
          options: dataSource.value,
          placeholder: "请选择商品分类",
          modelValue: cascaderValues.value,
          "onUpdate:modelValue": val => {
            const _val = val as string[];
            cascaderValues.value = _val;
            initParam.classifyId = _val[_val.length - 1];
          },
          props: {
            expandTrigger: "hover",
            value: "id",
            label: "classifyName",
            children: "respList"
          }
        });
      }
    }
  },
  {
    prop: "goodsListImg",
    label: "图片"
  },
  {
    prop: "goodsNum",
    label: "商品编号",
    search: { el: "input" }
  },
  {
    prop: "goodsName",
    label: "商品名称",
    search: { el: "input" }
  },
  {
    prop: "sellLowPrice",
    label: "商品售价"
  },
  { prop: "sellCount", label: "销量" },
  { prop: "inventoryCount", label: "库存" },
  {
    prop: "sellHot",
    label: "是否热销",
    enum: userStore.dataType.YesOrNo,
    fieldNames: { label: "value", value: "type" }
  },
  {
    prop: "statusCode",
    label: "状态",
    enum: userStore.dataType.GoodsStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum || 1,
    pageSize: res.pageSize || 20
  };
};

const onEdit = (data: any) => {
  console.log(data);
};

onMounted(() => {
  queryProductCategoryList("goods").then(res => {
    dataSource.value = res;
  });
});
</script>
