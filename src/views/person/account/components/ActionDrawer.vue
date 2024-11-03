<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" :size="'600px'" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
      style="max-width: 95%"
    >
      <el-row v-if="drawerProps.title === '查看'" :gutter="15">
        <el-row v-if="active === 1">
          <el-col :span="24">
            <el-form-item label="关联方编号">
              <el-input v-model="drawerProps.row!.merchantNum" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联方名称">
              <el-input v-model="drawerProps.row!.merchantName" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联方简称">
              <el-input v-model="drawerProps.row!.merchantShortName" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联方类型">
              <el-select v-model="drawerProps.row!.merchantType" :disabled="drawerProps.isView">
                <el-option v-for="item in MerchantType" :key="item.type" :label="item.value" :value="item.type" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联方角色">
              <el-input v-model="drawerProps.row!.subMerchantRole" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="法人姓名">
              <el-input v-model="drawerProps.row!.lawPersonName" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系人">
              <el-input v-model="drawerProps.row!.contractUserName" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="法人电话">
              <el-input v-model="drawerProps.row!.lawPersonTelephone" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系电话">
              <el-input v-model="drawerProps.row!.contractTelephone" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系人邮箱">
              <el-input v-model="drawerProps.row!.contractEmail" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="text-align-center pl-75px">
            <el-button type="primary" @click="active = 2">下一步，银行信息</el-button>
          </el-col>
        </el-row>
        <el-row v-if="active === 2">
          <el-col :span="24">
            <el-form-item label="银行账户">
              <el-input v-model="drawerProps.row!.bankAccount" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="银行账号">
              <el-input v-model="drawerProps.row!.bankCardNumber" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="银行名称">
              <el-input v-model="drawerProps.row!.bankName" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开户行">
              <el-input v-model="drawerProps.row!.bankOpenName" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="省/市/县">
              <el-cascader
                v-model="areaCode"
                :options="enumsStore.provinceCityCounty"
                ref="cascaderRef"
                :disabled="drawerProps.isView"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="法人姓名">
              <el-input v-model="drawerProps.row!.lawPersonName" :disabled="drawerProps.isView" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="flex justify-center pl-75px">
              <el-button @click="active = 1">上一步</el-button>
              <el-button type="primary" @click="active = 3">下一步，证件信息</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="active === 3">
          <el-col :span="24">
            <el-form-item label="营业执照">
              <img
                v-if="drawerProps.row!.licenceUrl"
                :src="drawerProps.row!.licenceUrl"
                alt=""
                class="w-100% h-180px b-1px divide-solid b-rd-5px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开户许可证">
              <img
                v-if="drawerProps.row!.openAccountLicenceUrl"
                :src="drawerProps.row!.openAccountLicenceUrl"
                alt=""
                class="w-100% h-180px b-1px divide-solid b-rd-5px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="法人身份证正面">
              <img
                v-if="drawerProps.row!.legalLicenceFrontUrl"
                :src="drawerProps.row!.legalLicenceFrontUrl"
                alt=""
                class="w-100% h-180px b-1px divide-solid b-rd-5px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="法人身份证反面">
              <img
                v-if="drawerProps.row!.legalLicenceBackUrl"
                :src="drawerProps.row!.legalLicenceBackUrl"
                alt=""
                class="w-100% h-180px b-1px divide-solid b-rd-5px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="text-align-center pl-75px">
            <el-button @click="active = 2">上一步，银行信息</el-button>
          </el-col>
        </el-row>
      </el-row>

      <div v-if="drawerProps.title === '处置'">
        <el-form-item label="处置" prop="statusCode">
          <el-radio-group v-model="drawerProps.row!.statusCode">
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
        <el-form-item label="原因" class="mt-50px">
          <el-input v-model="drawerProps.row!.statusMsg" :rows="5" type="textarea" placeholder="请输入原因" />
        </el-form-item>
      </div>

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

import { relatedPartyAccountsDetailApi, relatedPartyAccountAttachmentsDetailApi, riskRuleApi } from "@/api/modules/person";
import type { ResultData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import useEnumsStore from "@/stores/modules/enums";
const enumsStore = useEnumsStore();

const userStore = useUserStore();
const { MerchantType = [] } = userStore.dataType;

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const disposalItems = ref({});

const rules = reactive({
  statusCode: [{ required: true, message: "必填" }],
  approveResult: [{ required: true, message: "必填" }]
});
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

const active = ref(1);
const areaCode = ref<any>([]);
const getDetails = async () => {
  const id = drawerProps.value.row.merchantNum;
  if (!id) return;
  const res: ResultData = await relatedPartyAccountsDetailApi({ id });
  if (res.data.provinceCode && res.data.cityCode && res.data.areaCode) {
    areaCode.value = [res.data.provinceCode, res.data.cityCode, res.data.areaCode];
  }
  const res2: ResultData = await relatedPartyAccountAttachmentsDetailApi({ id });
  // TODO：res2 数据要进一部处理
  drawerProps.value.row = {
    ...res.data,
    ...res2.data
  };
  if (drawerProps.value.row.merchantFiles?.length > 0) {
    drawerProps.value.row.merchantFiles.map(item => {
      drawerProps.value.row[item.fileType] = item.filePath;
    });
  }
};

const getRiskRule = async () => {
  const id = drawerProps.value.row.merchantNum;
  if (!id) return;
  const res: ResultData = await riskRuleApi({ id });
  disposalItems.value = res.data || {};
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.title === "查看") {
    active.value = 1;
    getDetails();
  } else if (drawerProps.value.title === "处置") {
    getRiskRule();
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
