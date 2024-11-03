<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" :size="'600px'" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row v-if="drawerProps.title === '创建开户申请'" :gutter="15">
        <el-col :span="24">
          <el-form-item label="公司编号">
            <el-input v-model="drawerProps.row!.merchantNum" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公司名称">
            <el-input v-model="drawerProps.row!.merchantName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公司简称">
            <el-input v-model="drawerProps.row!.merchantShortName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公司类型">
            <el-input v-model="drawerProps.row!.merchantType" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="法人姓名">
            <el-input v-model="drawerProps.row!.lawPersonName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="法人联系电话" prop="lawPersonTelephone">
            <el-input v-model="drawerProps.row!.lawPersonTelephone" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系人">
            <el-input v-model="drawerProps.row!.contractUserName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系人电话" prop="contractTelephone">
            <el-input v-model="drawerProps.row!.contractTelephone" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="银行VB账户服务商">
            <el-input v-model="drawerProps.row!.payCpCode" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="drawerProps.title === '查看'" :gutter="15">
        <el-col :span="24">
          <el-form-item label="关联方编号">
            <el-input v-model="drawerProps.row!.merchantNum" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联方名称">
            <el-input v-model="drawerProps.row!.merchantName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开户银行">
            <el-input v-model="drawerProps.row!.bankName" class="w-90%" />
            <el-icon class="ml-2 cursor-pointer" @click="copyText(drawerProps.row!.bankName)">
              <DocumentCopy />
            </el-icon>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="银行账号">
            <el-input v-model="drawerProps.row!.bankCardNumber" class="w-90%" />
            <el-icon class="ml-2 cursor-pointer" @click="copyText(drawerProps.row!.bankCardNumber)">
              <DocumentCopy />
            </el-icon>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";

import { merchantBankMerDetailApi, merchantBankDetailApi } from "@/api/modules/finance";
import type { ResultData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import { copyText } from "@/utils/index";

const userStore = useUserStore();

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const rules = reactive({
  lawPersonTelephone: [
    { required: true, message: "必填" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ],
  contractTelephone: [
    { required: true, message: "必填" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ]
});
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

const getDetails = async () => {
  const id = drawerProps.value.row.id;
  if (!id) return;
  const res: ResultData = await merchantBankDetailApi({ id });
  drawerProps.value.row = {
    ...res.data
  };
};

const getBankMerDetail = async () => {
  const id = userStore.userInfo.id;
  if (!id) return;
  merchantBankMerDetailApi({ id })
    .then((res: ResultData) => {
      drawerProps.value.row = {
        ...res.data
      };
      drawerVisible.value = true;
    })
    .catch(err => {
      console.error(11111, err);
    });
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  if (drawerProps.value.title === "查看") {
    getDetails();
    drawerVisible.value = true;
  } else if (drawerProps.value.title === "创建开户申请") {
    getBankMerDetail();
  }
};

const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row,
        id: drawerProps.value.row.merchantNum
      };
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
