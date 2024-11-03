<template>
  <el-dialog
    v-model="visible"
    title="分润明细"
    width="800"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="120" size="large">
      <el-form-item label="分润角色" prop="merchantRoleId">
        <el-select
          v-model="formData.merchantRoleId"
          placeholder="请选择分润角色"
          @change="querySubMerchants"
          :disabled="!!formData.id"
        >
          <el-option v-for="item in subMerchantRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
        </el-select>
      </el-form-item>
      <el-form-item label="分润模式" prop="splitType">
        <el-select v-model="formData.splitType" placeholder="请选择分润模式">
          <el-option v-for="item in FeeType" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额/费率" prop="splitValue">
        <el-input-number placeholder="请输入分润金额/费率" v-model="formData.splitValue" :min="0" />
        <span>{{ `${formData.splitType === "fix" ? "元" : "%"}` }}</span>
      </el-form-item>
      <el-form-item label="关联方" prop="memberId">
        <el-select v-model="formData.memberId" placeholder="搜索关联方" :disabled="!formData.merchantRoleId || !!formData.id">
          <el-option v-for="item in subMerchants" :key="item.merchantNum" :label="item.merchantName" :value="item.merchantNum" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="statusCode" v-if="formData.id">
        <el-select v-model="formData.statusCode" placeholder="请选择状态">
          <el-option v-for="item in BaseStatus" :key="item.type" :label="item.value" :value="item.type" />
        </el-select>
      </el-form-item>
      <el-form-item label="分润说明">
        <el-input
          v-model="formData.statusMsg"
          type="textarea"
          placeholder="请输入分润说明"
          :rows="4"
          :maxlength="100"
          resize="none"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存规则信息</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { querySubMerchantsApi, splitRuleLineAddApi, splitRuleLineUpdateApi, subMerchantsRoleApi } from "@/api/modules/inventory";
import { useUserStore } from "@/stores/modules/user";

const { FeeType, BaseStatus } = useUserStore().dataType;
const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const subMerchants = ref<Inventory.ManufacturerMerchants[]>([]);
const subMerchantRoles = ref<Inventory.MerchantRole[]>([]);
const formData = reactive<Inventory.SplitRuleLineDetail>({
  id: "",
  ruleId: "",
  merchantRoleId: "",
  merchantRoleName: "",
  splitType: "",
  splitValue: 0,
  statusMsg: "",
  statusCode: "",
  memberId: "",
  memberName: ""
});

const rules = reactive<FormRules<Inventory.SplitRuleLineDetail>>({
  merchantRoleId: [{ required: true, message: "请选择分润角色", trigger: "change" }],
  splitType: [{ required: true, message: "请选择分润模式", trigger: "change" }],
  splitValue: [{ required: true, message: "请输入分润金额/费率", trigger: "blur" }],
  memberId: [{ required: true, message: "请选择关联方", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    formData.memberName = subMerchants.value.find(item => item.merchantNum === formData.memberId)?.merchantName || "";
    formData.merchantRoleName = subMerchantRoles.value.find(item => item.roleId === formData.merchantRoleId)?.roleName || "";
    if (formData.id) {
      await splitRuleLineUpdateApi(formData);
    } else {
      await splitRuleLineAddApi(formData);
    }
    visible.value = false;
    emit("success");
  } catch (error) {}
};

const onReset = () => {
  formData.id = "";
  formData.ruleId = "";
  formData.merchantRoleId = "";
  formData.merchantRoleName = "";
  formData.splitType = "";
  formData.splitValue = 0;
  formData.statusMsg = "";
  formData.statusCode = "";
  formData.memberId = "";
  formData.memberName = "";
};

const querySubMerchantRoles = async () => {
  const roles = await subMerchantsRoleApi();
  subMerchantRoles.value = roles.data || [];
  visible.value = true;
};

const querySubMerchants = async (roleId: string) => {
  const res = await querySubMerchantsApi({ startPage: false, roleId });
  subMerchants.value = res.data || [];
};

defineExpose({
  open(data: Inventory.SplitRuleLineDetail | string) {
    onReset();
    if (typeof data === "string") {
      formData.ruleId = data;
    } else {
      formData.id = data.id;
      formData.ruleId = data.ruleId;
      formData.merchantRoleId = data.merchantRoleId;
      formData.merchantRoleName = data.merchantRoleName;
      formData.splitType = data.splitType;
      formData.splitValue = data.splitValue;
      formData.statusMsg = data.statusMsg;
      formData.statusCode = data.statusCode;
      formData.memberId = data.memberId;
      formData.memberName = data.memberName;
      querySubMerchants(data.merchantRoleId);
    }
    querySubMerchantRoles();
  }
});
</script>
