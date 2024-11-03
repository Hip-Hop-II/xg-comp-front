<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      :label-width="drawerProps.title === '查看' ? '150px' : '100px'"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row v-if="drawerProps.title === '审核'">
        <el-col :span="24">
          <el-form-item label="审核" prop="approveResult">
            <el-radio-group v-model="drawerProps.row!.approveResult">
              <el-radio :value="1">通过</el-radio>
              <el-radio :value="0">退回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="原因" prop="reason" :required="drawerProps.row.approveResult === 0">
            <el-input v-model="drawerProps.row!.reason" :rows="5" type="textarea" placeholder="请输入原因" />
          </el-form-item>
        </el-col>
      </el-row>

      <div v-if="drawerProps.title === '退回'">
        <el-form-item label="审核人">
          <el-input v-model="drawerProps.row!.consumerName" disabled />
        </el-form-item>
        <el-form-item label="审核时间">
          <el-input v-model="drawerProps.row!.consumerName" disabled />
        </el-form-item>
        <el-form-item label="审核结果">
          <el-input v-model="drawerProps.row!.consumerName" disabled />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="drawerProps.row!.consumerName" disabled />
        </el-form-item>
      </div>

      <div v-if="drawerProps.title === '拒绝'">
        <el-form-item label="说明" prop="reason">
          <el-input v-model="drawerProps.row!.reason" :rows="5" type="textarea" placeholder="请输入原因" />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";
import type { FormInstance } from "element-plus";

import { fundWithdrawDetailApi } from "@/api/modules/finance";
import type { ResultData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
// const { RiskRuleConsumer } = userStore.dataType;

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

const rules = reactive({
  points: [{ required: true, message: "必填" }],
  approveResult: [{ required: true, message: "必填" }],
  reason: [{ required: true, message: "必填" }],
  riskRule: [{ required: true, message: "必填" }]
});

// const disposalItems = ref(RiskRuleConsumer);

const getRiskRule = async () => {
  // const id = drawerProps.value.row.id;
  // if (!id) return;
  // const res: ResultData = await riskRuleApi({ id });
  // disposalItems.value = res.data || {};
};

const getDetails = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await fundWithdrawDetailApi({ id });
  drawerProps.value.row.value = {
    ...res.data
  };
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.title === "查看") {
    getDetails();
  } else if (drawerProps.value.title === "异常处置") {
    getRiskRule();
  }
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row
      };
      if (drawerProps.value.title === "积分发放") {
        params.id = userStore.userInfo.id;
      }
      const res: ResultData = await drawerProps.value.api!(params);
      console.log(11111, res);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
.radioStyle {
  display: grid;
  .el-radio {
    margin: 10px 0;
    white-space: wrap;
  }
}
</style>
