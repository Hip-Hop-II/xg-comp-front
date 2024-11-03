<template>
  <div class="w-full mt-5 specification-table">
    <TablePro
      ref="TableProRef"
      :columns="columns"
      :request-api="queryGoodsModelList"
      :init-params="initParams"
      :height="200"
      :max-height="400"
      :pagination="false"
    >
      <template #tableHeader>
        <el-space alignment="center">
          <el-button type="primary" @click="onCreate">新增规格</el-button>
          <p class="mt-0 text-sm">库存商品数量低于库存阈值将在预警中查看</p>
        </el-space>
      </template>
      <template #action="scope">
        <el-button type="primary" link @click="onEdit(scope.row)">编辑</el-button>
        <el-popconfirm title="确定要删除这条规格数据吗？">
          <template #reference>
            <el-button type="danger" link @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </TablePro>
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="90" size="large" class="w-xl ml-4">
      <el-form-item label="退货地址" prop="backAddressId">
        <el-select v-model="formData.backAddressId" filterable placeholder="请选择退货地址">
          <el-option v-for="item in userStore.dataType.YesOrNo" :key="item.value" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="售后支持" prop="sellAfterSupport">
        <el-checkbox-group v-model="formData.sellAfterSupport">
          <el-checkbox value="1" label="仅退款(无需退货)" size="large" />
          <el-checkbox value="2" label="退货退款" size="large" />
          <el-checkbox value="3" label="换货" size="large" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button>上一步</el-button>
        <el-button type="primary" @click="onSubmit">保存，下一步</el-button>
      </el-form-item>
    </el-form>
    <skus-modal ref="modalRef" @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ProTableInstance, ColumnProps } from "@/components/TablePro/interface/index";
import TablePro from "@/components/TablePro/index.vue";
import { deleteGoodsModel, queryGoodsModelList } from "@/api/modules/business";
import SkusModal from "./SkusModal.vue";
import { useUserStore } from "@/stores/modules/user";
import type { FormInstance, FormRules } from "element-plus";

interface FormData {
  backAddressId: string;
  sellAfterSupport: string[];
}

const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore();
const TableProRef = ref<ProTableInstance>();
const modalRef = ref<any>();
const initParams = reactive({ startPage: false });
const formData = reactive<FormData>({
  backAddressId: "",
  sellAfterSupport: []
});
const rules = reactive<FormRules<FormData>>({
  backAddressId: [{ required: true, message: "请选择退货地址", trigger: "change" }],
  sellAfterSupport: [{ required: true, message: "请选择售后支持", trigger: "change" }]
});
const columns = reactive<ColumnProps[]>([
  { prop: "goodsModel", label: "规格" },
  { prop: "sellPrice", label: "售价" },
  { prop: "costPrice", label: "成本价" },
  { prop: "inventoryCount", label: "库存" },
  { prop: "inventoryThreshold", label: "库存阈值" },
  { prop: "goodsNum", label: "商品编号" },
  { prop: "weight", label: "重量(kg)" },
  { prop: "volume", label: "体积(cm)" },
  { prop: "statusCode", label: "状态", enum: userStore.dataType.BaseStatus, fieldNames: { label: "value", value: "type" } },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const onSuccess = () => {
  TableProRef.value?.getTableList();
};
const onCreate = () => {
  modalRef.value?.open();
};
const onEdit = (data: any) => {
  console.log(data);
};
const onDelete = async (data: any) => {
  await deleteGoodsModel({ ids: [data.id] });
  TableProRef.value?.getTableList();
};
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    // await addGoodsSecondInfo(formData);
    ruleFormRef.value?.resetFields();
  } catch (error) {}
};
</script>

<style lang="scss" scoped>
.specification-table {
  :deep(.card) {
    border: none;
    box-shadow: none;
  }
}
</style>
