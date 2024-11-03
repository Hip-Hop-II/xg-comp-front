<template>
  <div class="table-box h-120">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="splitRuleLinePageListApi"
      :data-callback="dataCallback"
      :init-param="initParam"
      :pagination="false"
    >
      <template #tableHeader>
        <el-button type="primary" @click="onEdit(props.ruleId)">新增分润明细</el-button>
      </template>
      <template #action="scope">
        <template v-if="scope.row.permitUpdate == 1">
          <el-button type="primary" link @click="onEdit(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="onDelete(scope.row)">删除</el-button>
        </template>
      </template>
    </TablePro>
    <ul class="pl-0">
      <li class="list-none">注：</li>
      <li class="list-none">1.资金入账方有且只能有一个，剩余资金将全部进入资金入账方</li>
      <li class="list-none">2.资金入账方只能是平台商</li>
      <li class="list-none">3.如果当前不参与分润，分润值设置为0即可</li>
    </ul>
    <split-rule-line-modal ref="modalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { splitRuleLinePageListApi } from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import SplitRuleLineModal from "./SplitRuleLineModal.vue";
import TablePro from "@/components/TablePro/index.vue";
import { ElMessageBox } from "element-plus";

const props = defineProps<{
  ruleId: string;
}>();

const modalRef = ref<any>();
const { FeeType } = useUserStore().dataType;
const TableProRef = ref<ProTableInstance>();
const initParam = reactive({
  startPage: false,
  ruleId: props.ruleId
});
const dataCallback = (res: any) => {
  return {
    list: res.data,
    total: res.total,
    pageNum: res.pageNum,
    pageSize: res.pageSize
  };
};
const columns = reactive<ColumnProps[]>([
  { type: "index", label: "序号", width: 70 },
  {
    prop: "merchantRoleName",
    label: "分润角色"
  },
  {
    prop: "splitType",
    label: "分润模式",
    enum: FeeType,
    fieldNames: { label: "value", value: "type" }
  },
  {
    prop: "splitValue",
    label: "分润值",
    width: 80,
    render: scope => {
      return `${scope.row.splitValue}${scope.row.splitType === "fix" ? "元" : "%"}`;
    }
  },
  { prop: "statusMsg", label: "分润说明" },
  { prop: "action", label: "操作", fixed: "right", width: 110 }
]);
const onEdit = (data: Inventory.SplitRuleLineDetail | string) => {
  modalRef.value?.open(data);
};
const onDelete = (data: Inventory.SplitRuleLineDetail) => {
  ElMessageBox.confirm("确定要删除该分润明细吗？", "Warning", {
    type: "warning"
  })
    .then(() => {
      console.log(data);
      ElMessage({
        type: "success",
        message: "Delete completed"
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除"
      });
    });
};
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
</script>
