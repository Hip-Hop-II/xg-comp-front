<template>
  <el-dialog
    v-model="visible"
    title="管理员信息"
    width="500"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="formData"
      ref="ruleFormRef"
      :rules="rules"
      label-suffix=":"
      :label-width="100"
      size="large"
      label-position="left"
    >
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="formData.userName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="userTelephone">
        <el-input style="width: 100%" :maxlength="11" v-model="formData.userTelephone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="权限清单" prop="authFunctions">
        <el-checkbox-group v-model="formData.authFunctions">
          <el-checkbox value="0" name="authFunctions">平台管理员权限配置</el-checkbox>
          <el-checkbox value="1" name="authFunctions">功能配置</el-checkbox>
          <el-checkbox value="2" name="authFunctions">权益配置</el-checkbox>
          <el-checkbox value="3" name="authFunctions">硬件设备分润配置</el-checkbox>
          <el-checkbox value="4" name="authFunctions">赚钱套餐分润配置</el-checkbox>
          <el-checkbox value="5" name="authFunctions">流量套餐分润配置</el-checkbox>
          <el-checkbox value="6" name="authFunctions">供应链商品分润配置</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" prop="statusCode" v-if="formData.id">
        <el-select v-model="formData.statusCode" placeholder="请选择状态">
          <el-option v-for="s in userStore.dataType.BaseStatus" :key="s.type" :label="s.value" :value="s.type" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { merchantAuthorityAddApi, merchantAuthorityUpdateApi } from "@/api/modules/inventory";

interface FormData {
  id: string;
  userName: string;
  userTelephone: string;
  authFunctions: string[];
  statusCode: string;
  statusMsg: string;
}

const userStore = useUserStore();
const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const formData = reactive<FormData>({
  id: "",
  userName: "",
  userTelephone: "",
  authFunctions: [],
  statusCode: "",
  statusMsg: ""
});
const rules = reactive<FormRules<Omit<FormData, "respList">>>({
  userName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  userTelephone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  authFunctions: [{ required: true, message: "请选择权限清单", trigger: "change" }]
});
const emit = defineEmits<{
  success: [];
}>();
const onSubmit = async () => {
  try {
    const data = toRaw(formData) as any;
    data.authFunctions = data.authFunctions.join(",");
    if (data.id) {
      data.statusMsg = userStore.dataType.BaseStatus.find(item => item.type === data.statusCode).value;
      await merchantAuthorityUpdateApi(data);
    } else {
      await merchantAuthorityAddApi({
        authFunctions: data.authFunctions,
        userName: data.userName,
        userTelephone: data.userTelephone
      });
    }
    visible.value = false;
    emit("success");
  } catch (error) {}
};
const resetFields = () => {
  formData.id = "";
  formData.userName = "";
  formData.userTelephone = "";
  formData.authFunctions = [];
  formData.statusCode = "";
  formData.statusMsg = "";
};

defineExpose({
  open(data?: Inventory.Authority) {
    visible.value = true;
    if (data) {
      formData.id = data.id;
      formData.userName = data.userName;
      formData.userTelephone = data.userTelephone;
      formData.authFunctions = data.authFunctions.split(",");
      formData.statusCode = data.statusCode;
      formData.statusMsg = data.statusMsg;
    } else {
      resetFields();
    }
  }
});
</script>
