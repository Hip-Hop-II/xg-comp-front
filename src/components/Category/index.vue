<template>
  <div>
    <div class="mb-4">
      <el-button type="primary" size="large" @click="addType()">添加分类</el-button>
    </div>
    <el-tree
      style="max-width: 600px"
      :data="dataSource"
      node-key="id"
      default-expand-all
      :props="{ label: 'classifyName', children: 'respList', class: () => 'product-category-tree-node' }"
    >
      <template #default="{ node, data }">
        <div class="flex-1" @click="onNodeClick(data)">{{ node.label }}</div>
        <el-space>
          <el-button type="primary" link @click="addType(data.classifyCode)">添加子类</el-button>
          <el-button type="primary" link @click="updateType(data)">编辑</el-button>
        </el-space>
      </template>
    </el-tree>
    <pc-modal ref="modalRef" @success="onSuccess" :type="props.type" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PcModal from "./components/PcModal.vue";
import { queryProductCategoryTree } from "@/api/modules/business";

const props = defineProps<{ type: string }>();

const dataSource = ref<BusinessSpace.ProductCategory[]>([]);
const modalRef = ref<any>();

const addType = (id?: string) => {
  modalRef.value?.open(id);
};

const updateType = (data: BusinessSpace.ProductCategory) => {
  modalRef.value?.open(data);
};

const onSuccess = async () => {
  const res = await queryProductCategoryTree(props.type, "0");
  dataSource.value = res.data;
};

const onNodeClick = async (data: BusinessSpace.ProductCategory) => {
  if (!data.respList) {
    const res = await queryProductCategoryTree(props.type, data.classifyCode);
    data.respList = res.data || [];
  }
};

onMounted(() => {
  onSuccess();
});
</script>

<style lang="scss">
.product-category-tree-node {
  .el-tree-node__content {
    height: auto;
    padding: 10px;
  }
}
</style>
