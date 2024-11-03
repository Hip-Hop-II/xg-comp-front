<template>
  <el-dialog v-model="visible" title="运费模版" width="800" destroy-on-close :before-close="beforeClose">
    <el-form
      :model="formData"
      ref="ruleFormRef"
      :rules="rules"
      label-suffix=":"
      :label-width="60"
      label-position="left"
      size="large"
    >
      <el-form-item label="名称" prop="templateName">
        <el-input v-model="formData.templateName" placeholder="请输入收件人名称" />
      </el-form-item>
      <el-form-item label="状态" prop="statusCode">
        <el-select v-model="formData.statusCode" placeholder="请选择状态">
          <el-option v-for="item in userStore.dataType.BaseStatus" :key="item.value" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入说明"
          :rows="4"
          :maxlength="100"
          resize="none"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <TablePro :columns="columns" :data="formData.lines" :pagination="false" :height="200" :max-height="400">
      <template #action="scope">
        <el-space>
          <el-button type="primary" link @click="addTemplateLines(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除这条物流模版数据吗？">
            <template #reference>
              <el-button type="danger" link @click="onDelete(scope.$index)">删除</el-button>
            </template>
          </el-popconfirm>
        </el-space>
      </template>
    </TablePro>
    <el-button class="w-full mt-4" size="large" style="border-style: dashed" @click="addTemplateLines()">添加模版内容</el-button>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
    <freight-template-content-modal ref="ftcmRef" @submit="onContentSubmit" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ColumnProps } from "@/components/TablePro/interface/index";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import TablePro from "@/components/TablePro/index.vue";
import { useUserStore } from "@/stores/modules/user";
import FreightTemplateContentModal from "./FreightTemplateContentModal.vue";
import { addFreightTemplate } from "@/api/modules/business";

const ruleFormRef = ref<FormInstance>();
const ftcmRef = ref<any>();
const userStore = useUserStore();
const visible = ref(false);
const columns = reactive<ColumnProps[]>([
  {
    prop: "province",
    label: "收费省份",
    render: scope => {
      return scope.row.province.replaceAll(",", "、") || "无";
    }
  },
  { prop: "freight", label: "收费金额", width: 90 },
  {
    prop: "statusCode",
    label: "状态",
    width: 80,
    enum: userStore.dataType.BaseStatus,
    fieldNames: { label: "value", value: "type" }
  },
  { prop: "action", label: "操作", fixed: "right", width: 200 }
]);
const formData = reactive<BusinessSpace.FreightTemplateForm>({
  templateName: "",
  remark: "",
  statusCode: "",
  lines: []
});
const rules = reactive<FormRules<BusinessSpace.FreightTemplateForm>>({
  templateName: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  statusCode: [{ required: true, message: "请选择状态", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const addTemplateLines = (data?: BusinessSpace.FreightTemplateLineItem) => {
  if (data && !data.templateId) {
    data.templateId = Date.now();
  }
  ftcmRef.value?.open(data);
};
const onDelete = (index: number) => {
  formData.lines.splice(index, 1);
};
const onContentSubmit = (data: BusinessSpace.FreightTemplateLineItem) => {
  if (data.templateId) {
    const index = formData.lines.findIndex(item => item.templateId === data.templateId);
    formData.lines[index] = data;
  } else {
    formData.lines.push(data);
  }
};
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    if (formData.lines.length === 0) {
      ElMessage.error("请添加模版内容");
      return;
    }
    await addFreightTemplate(formData);
    visible.value = false;
    emit("success");
    ruleFormRef.value?.resetFields();
  } catch (error) {}
};
const beforeClose = (done: () => void) => {
  ruleFormRef.value?.resetFields();
  done();
};

defineExpose({
  open() {
    visible.value = true;
  }
});
</script>
