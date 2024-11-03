<template>
  <div class="h-full">
    <div class="table-box">
      <TablePro
        ref="TableProRef"
        :columns="columns"
        :request-api="queryGoodsModelList"
        :data-callback="dataCallback"
        :init-param="initParam"
      >
        <template #action="scope">
          <el-button type="primary" link @click="onEdit(scope.row)">编辑</el-button>
          <el-button type="primary" link @click="toOffline(scope.row)">下架</el-button>
          <el-button type="primary" link @click="toRecycle(scope.row)">放入回收站</el-button>
        </template>
      </TablePro>
    </div>
    <alert-modal ref="modalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { queryGoodsModelList, queryProductCategoryList, updateGoodsModel } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox, ElMessage, ElCascader } from "element-plus";
import AlertModal from "./AlertModal.vue";

const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const modalRef = ref<any>();
const dataSource = ref<BusinessSpace.ProductCategory[]>([]);
const initParam = reactive({
  classifyId: "",
  isWarning: true
});
const cascaderValues = ref<string[]>([]);

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
    prop: "modelImgUrls",
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
    prop: "goodsModel",
    label: "规格"
  },
  { prop: "inventoryLowNum", label: "库存阈值" },
  { prop: "inventoryCount", label: "库存数量" },
  {
    prop: "statusCode",
    label: "状态",
    isShow: false,
    enum: userStore.dataType.GoodsStatus,
    fieldNames: { label: "value", value: "type" },
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);

const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};

const onEdit = (data: any) => {
  modalRef.value?.open(data);
};

const toOffline = (data: any) => {
  ElMessageBox.confirm("商品确定下架吗？", "Warning", {
    type: "warning"
  })
    .then(() => {
      updateGoodsModel({ ...data, sellStatus: "0" }).then(() => {
        ElMessage({
          type: "success",
          message: "商品已下架"
        });
        TableProRef.value?.getTableList();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消下架操作"
      });
    });
};

const toRecycle = (data: any) => {
  ElMessageBox.confirm("商品确定放入回收站吗？", "Warning", {
    type: "warning"
  })
    .then(() => {
      updateGoodsModel({ ...data, statusCode: "cancel" }).then(() => {
        ElMessage({
          type: "success",
          message: "商品已放入回收站"
        });
        TableProRef.value?.getTableList();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消放入回收站操作"
      });
    });
};
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
onMounted(() => {
  queryProductCategoryList("goods").then(res => {
    dataSource.value = res;
  });
});
</script>
