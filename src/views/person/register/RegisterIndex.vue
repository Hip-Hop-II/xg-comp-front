<template>
  <div class="table-box">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('创建')">创建邀请</el-button>
      </template>
      <!-- 表格操作 -->
      <template #action="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)"> 查看邀请码 </el-button>
        <el-button
          v-if="scope.row.statusCode === 'register' && scope.row.inviteUrl"
          type="primary"
          link
          :icon="EditPen"
          @click="openDrawer('编辑', scope.row)"
        >
          编辑
        </el-button>
      </template>
    </TablePro>

    <RegisterDrawer ref="RegisterDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { reactive, ref } from "vue";
import { EditPen, CirclePlus, View } from "@element-plus/icons-vue";

import { timestampToDate } from "@/utils/index";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { queryListApi, subMerInviteCreateApi, subMerInviteSaveApi } from "@/api/modules/person";
import RegisterDrawer from "./components/RegisterDrawer.vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const { SubMerInviteStatus, SubMerType } = userStore.dataType;

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  { prop: "inviteCode", label: "邀请编号", search: { el: "input" } },
  { prop: "inviteName", label: "被邀请方昵称", search: { el: "input" } },
  {
    prop: "createTime",
    label: "邀请时间",
    render: scope => {
      return <span>{timestampToDate(scope.row.createTime)}</span>;
    }
  },
  { prop: "inviteValidity", label: "邀请链接有效期(天)", width: 160 },
  { prop: "inviteUserName", label: "邀请人" },
  { prop: "inviteType", label: "类型", enum: SubMerType, fieldNames: { label: "value", value: "type" } },
  { prop: "roleName", label: "被邀请方角色" },
  {
    prop: "statusCode",
    label: "状态",
    search: { el: "select" },
    enum: SubMerInviteStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "action", label: "操作", fixed: "right", width: 230 }
]);

// 如果表格需要初始化请求参数，直接定义传给 TablePro (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
// TablePro 实例
const TableProRef = ref<ProTableInstance>();

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 TablePro 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return queryListApi(newParams);
};

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (res: any) => {
  return {
    list: res.data || [],
    total: res.total || 0,
    pageNum: res.pageNum || 1,
    pageSize: res.pageSize || 10
  };
};

// 打开 drawer(新增、查看、编辑)
const RegisterDrawerRef = ref<InstanceType<typeof RegisterDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "创建" ? subMerInviteCreateApi : title === "编辑" ? subMerInviteSaveApi : undefined,
    getTableList: TableProRef.value?.getTableList
  };
  RegisterDrawerRef.value?.acceptParams(params);
};
</script>
