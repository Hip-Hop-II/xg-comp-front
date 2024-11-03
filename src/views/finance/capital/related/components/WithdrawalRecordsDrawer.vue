<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" :size="'600px'" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
      style="max-width: 95%"
    >
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item label="提现编号">
            <el-input v-model="drawerProps.row!.id" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="会员编号">
            <el-input v-model="drawerProps.row!.memberId" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="会员姓名">
            <el-input v-model="drawerProps.row!.memberName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="会员手机号">
            <el-input v-model="drawerProps.row!.telephone" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="银行卡号">
            <el-input v-model="drawerProps.row!.bankCardNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="状态说明">
            <el-input v-model="drawerProps.row!.statusMsg" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="WithdrawalRecordsDrawer">
import { ref } from "vue";

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

defineExpose({
  acceptParams
});
</script>
