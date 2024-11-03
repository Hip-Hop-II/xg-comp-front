<template>
  <div class="table-box">
    <TablePro ref="TableProRef" title="菜单列表" row-key="path" :indent="20" :columns="columns" :data="menuData">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('创建')">新增菜单 </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #action>
        <el-button type="primary" link :icon="EditPen"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete"> 删除 </el-button>
      </template>
    </TablePro>
    <MenuDrawer ref="MenuDrawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";

import type { ColumnProps } from "@/components/TablePro/interface";
import authMenuList from "@/assets/json/authMenuList.json";
import TablePro from "@/components/TablePro/index.vue";
import MenuDrawer from "./MenuDrawer.vue";
import { addAuthMenuListApi, editAuthMenuListApi } from "@/api/modules/login";

const TableProRef = ref();

const menuData = ref(authMenuList.data);

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input" } },
  { prop: "meta.icon", label: "菜单图标" },
  { prop: "name", label: "菜单名称", search: { el: "input" } },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input" } },
  { prop: "component", label: "组件路径", width: 300 },
  { prop: "action", label: "操作", width: 250, fixed: "right" }
];

// 打开 drawer(新增、查看、编辑)
const MenuDrawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "创建" ? addAuthMenuListApi : title === "编辑" ? editAuthMenuListApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  MenuDrawerRef.value?.acceptParams(params);
};
</script>
