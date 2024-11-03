<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    :size="drawerProps.title === '查看' ? '800px' : '600px'"
    :title="`${drawerProps.title}`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <div v-if="drawerProps.title === '积分发放'">
        <el-form-item label="积分发放" prop="points">
          <el-input-number v-model="drawerProps.row!.points" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="drawerProps.row!.reason" :rows="5" type="textarea" placeholder="请输入原因" />
        </el-form-item>
      </div>

      <div v-if="drawerProps.title === '查看'">
        <el-form-item label="用户ID">
          <el-input v-model="drawerProps.row!.id" />
        </el-form-item>
        <el-form-item label="用户编号">
          <el-input v-model="drawerProps.row!.consumerCode" />
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="drawerProps.row!.consumerName" />
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model="drawerProps.row!.telephone" />
        </el-form-item>
        <el-form-item label="实名认证">
          <el-input v-model="drawerProps.row!.realAuthTime" />
        </el-form-item>
        <el-form-item label="累计提现金额">
          <el-input v-model="drawerProps.row!.sumWithdrawMoney" />
        </el-form-item>
        <el-form-item label="累计消费金额">
          <el-input v-model="drawerProps.row!.sumPoMoney" />
        </el-form-item>
        <el-form-item label="累计售后次数">
          <el-input v-model="drawerProps.row!.sumSellAfterCount" />
        </el-form-item>
        <el-form-item label="参与任务次数">
          <el-input v-model="drawerProps.row!.totalTaskCount" />
        </el-form-item>
        <el-form-item label="累计获得积分">
          <el-input v-model="drawerProps.row!.sumPoints" />
        </el-form-item>
        <el-form-item label="实名认证时间">
          <el-input v-model="drawerProps.row!.realAuthTime" />
        </el-form-item>
        <el-form-item label="最后登录时间">
          <el-input v-model="drawerProps.row!.lastLoginTime" />
        </el-form-item>
        <el-form-item label="最后交易时间">
          <el-input v-model="drawerProps.row!.lastTradeTime" />
        </el-form-item>
        <el-form-item label="风控">
          <el-input v-model="drawerProps.row!.riskRule" />
        </el-form-item>
      </div>

      <div v-if="drawerProps.title === '异常处置'">
        <el-form-item label="处置" prop="riskRule">
          <el-radio-group v-model="drawerProps.row!.riskRule" class="flex">
            <el-radio
              v-for="(value, key) of disposalItems"
              :key="key"
              :value="key"
              class="items-start whitespace-normal mb-10px lh-16px"
            >
              {{ value }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因" prop="reason" class="mt-50px">
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

import { consumerDetailApi, consumerRiskRuleApi } from "@/api/modules/person";
import type { ResultData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();

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
  reason: [{ required: true, message: "必填" }],
  riskRule: [{ required: true, message: "必填" }]
});

const disposalItems = ref([]);

const getRiskRule = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await consumerRiskRuleApi({ id });
  disposalItems.value = res.data || {};
};

const getDetails = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await consumerDetailApi({ id });
  drawerProps.value.row = {
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
.el-radio-group {
  margin-bottom: 20px;
}
</style>
