<template>
  <el-form
    :model="merchantForm"
    :rules="ruleForm"
    label-suffix=" :"
    ref="formRuleRef"
    label-width="160"
    style="width: 1000px"
    class="bg-#fff pt-20px pb-20px pl-20px pr-20px"
  >
    <el-steps style="max-width: 1000px; margin-bottom: 10px" :space="200" :active="activeIndex" simple finish-status="success">
      <el-step title="企业信息" :icon="Edit" />
      <el-step title="资质信息" :icon="Edit" />
      <el-step title="其他材料" :icon="Upload" />
    </el-steps>
    <template v-if="activeIndex === 0">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="平台方编号">{{ merchantForm!.merchantNum }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台方类型">企业</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台方名称">{{ userStore.userInfo.merchantName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台方简称" prop="merchantShortName">
            <el-input v-model="merchantForm!.merchantShortName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="实际经营地址">
            <el-input v-model="merchantForm!.merchantAddress" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="消费者下单链接">
            <el-input v-model="merchantForm!.merchantProductUrl" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消费者登录测试账号">
            <el-input v-model="merchantForm!.merchantProductAccount" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消费者登录测试密码">
            <el-input v-model="merchantForm!.merchantProductPwd" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业分类">
            <el-cascader
              v-model="industry"
              :options="industryType"
              :props="{ checkStrictly: true }"
              @change="industryTypeChange"
              :show-all-levels="false"
              placeholder="请选择"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <template v-if="activeIndex === 1">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="法人身份证正面" prop="legalLicenceFrontUrl">
            <FileUpload
              v-model="merchantForm!.legalLicenceFrontUrl"
              :file-size="1"
              :limit="1"
              :biz-type="'legalLicenceFrontUrl'"
              :file-type-upload="'legalLicenceFrontUrl'"
            />
          </el-form-item>
          <el-form-item label="法人身份证反面" prop="legalLicenceBackUrl">
            <FileUpload
              v-model="merchantForm!.legalLicenceBackUrl"
              :file-size="1"
              :limit="1"
              :biz-type="'legalLicenceBackUrl'"
              :file-type-upload="'legalLicenceBackUrl'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人姓名"> {{ merchantForm!.lawPersonName }} </el-form-item>
          <el-form-item label="法人联系电话" prop="lawPersonTelephone">
            <el-input v-model="merchantForm!.lawPersonTelephone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系邮箱">
            <el-input v-model="merchantForm!.contractEmail" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="法人身份证号"> {{ merchantForm!.lawPersonIdNo }}</el-form-item>
          <el-form-item label="身份证有效期">
            {{ dateFormat(merchantForm!.lawPersonIdNoStart) + "至" + dateFormat(merchantForm!.lawPersonIdNoEnd) }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照" prop="licenceUrl">
            <FileUpload
              v-model="merchantForm!.licenceUrl"
              :file-size="1"
              :limit="1"
              :biz-type="'licenceUrl'"
              :file-type-upload="'licenceUrl'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统一社会信用代码"> {{ merchantForm!.socialCreditCode }} </el-form-item>
          <el-form-item label="有效期">
            {{ dateFormat(merchantForm!.socialCreditCodeStart) + "至" + dateFormat(merchantForm!.socialCreditCodeEnd) }}
          </el-form-item>
          <el-form-item label="注册地址"> {{ merchantForm!.socialCreditAddress }} </el-form-item>
          <el-form-item label="经营范围"> {{ merchantForm!.businessScope }} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户许可证" prop="openAccountLicenceUrl">
            <FileUpload
              v-model="merchantForm!.openAccountLicenceUrl"
              :file-size="1"
              :limit="1"
              :biz-type="'openAccountLicenceUrl'"
              :file-type-upload="'openAccountLicenceUrl'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行账户"> {{ merchantForm!.bankAccountName }} </el-form-item>
          <el-form-item label="省/市/县" prop="areaCode">
            <el-cascader
              v-model="areaCode"
              :options="enumsStore.provinceCityCounty"
              ref="cascaderRef"
              @change="handleChange"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="银行名称" prop="bankCode">
            <el-select
              v-model="merchantForm!.bankCode"
              filterable
              clearable
              remote
              :remote-method="remoteSearch"
              @clear="changeBankName('')"
              placeholder="请检索关键字"
            >
              <el-option
                v-for="item in bankOptions"
                :key="item.bankNum"
                :label="item.bankName"
                :value="item.bankNum"
                @click="changeBankName(item.bankName)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="银行账号" prop="bankCardNumber">
            <el-input v-model="merchantForm!.bankCardNumber" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="开户行" prop="bankOpenName">
            <el-input v-model="merchantForm!.bankOpenName" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <template v-if="activeIndex === 2">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="法人手持身份证照片" prop="legalPersonFrontUrl">
            <FileUpload
              v-model="merchantForm!.legalPersonFrontUrl"
              :file-size="1"
              :limit="1"
              :biz-type="'legalPersonFrontUrl'"
              :file-type-upload="'legalPersonFrontUrl'"
            />
            <div class="font-size-12px color-#666">仅限1张图片，要求法人上半身和身份证人像面清晰可见</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人手持营业执照照片" prop="handLicenceUrl">
            <FileUpload
              v-model="merchantForm!.handLicenceUrl"
              :file-size="1"
              :limit="1"
              :biz-type="'handLicenceUrl'"
              :file-type-upload="'handLicenceUrl'"
            />
            <div class="font-size-12px color-#666">仅限1张图片，要求法人上半身和营业执照清晰可见</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门头照" prop="businessPlacePhotoUrl">
            <FileUpload
              v-model="merchantForm!.businessPlacePhotoUrl"
              :file-size="1"
              :limit="1"
              :biz-type="'businessPlacePhotoUrl'"
              :file-type-upload="'businessPlacePhotoUrl'"
            />
            <div class="font-size-12px color-#666">仅限1张图片</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ICP备案" prop="icpCertificationUrl">
            <FileUpload
              v-model="merchantForm!.icpCertificationUrl"
              :file-size="1"
              :limit="1"
              :biz-type="'icpCertificationUrl'"
              :file-type-upload="'icpCertificationUrl'"
            />
            <div class="font-size-12px color-#666">仅限1张图片</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务场景说明" prop="businessScene">
            <FileUpload
              v-model="merchantForm!.businessScene"
              :file-size="1"
              :limit="1"
              :biz-type="'scenePhotoUrl'"
              :file-type-upload="'scenePhotoUrl'"
            />
            <div class="font-size-12px color-#666">仅限1张图片</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自愿开户视频" prop="openAccountVideoUrl">
            <FileUpload
              v-model="merchantForm!.openAccountVideoUrl"
              :file-size="5"
              :limit="1"
              :biz-type="'openAccountVideoUrl'"
              :file-type-upload="'openAccountVideoUrl'"
            />
            <div
              class="font-size-12px color-#666 line-height-18px mt-7px"
              v-html="
                '法人自愿开户视频1个，视频内容：“我是XXX有限公<br/>司法人XXX，现自愿申请开通账户”。视频要求：法<br/>人手持身份证对着摄像头，口音清晰、上半身全部拍到；'
              "
            ></div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工作环境照片" prop="scenePhotoUrl" class="noFlex">
            <FileUpload
              v-model="merchantForm!.scenePhotoUrl"
              :file-size="1"
              :limit="5"
              :biz-type="'scenePhotoUrl'"
              :file-type-upload="'scenePhotoUrl'"
            />
            <div class="font-size-12px color-#666">3-5张工作环境照</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="渠道合作协议" prop="agreementPhotoUrl" class="noFlex">
            <FileUpload
              v-model="merchantForm!.agreementPhotoUrl"
              :file-size="1"
              :limit="5"
              :biz-type="'agreementPhotoUrl'"
              :file-type-upload="'agreementPhotoUrl'"
            />
            <div class="font-size-12px color-#666">最多5张照片</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="产品支付场景截图" prop="pcScreenshotOfPaymentProcessUrl" class="noFlex">
            <FileUpload
              v-model="merchantForm!.pcScreenshotOfPaymentProcessUrl"
              :file-size="1"
              :limit="5"
              :biz-type="'pcScreenshotOfPaymentProcessUrl'"
              :file-type-upload="'pcScreenshotOfPaymentProcessUrl'"
            />
            <div class="font-size-12px color-#666">最多5张照片</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="办公场所租房协议" prop="workPlaceRentUrl" class="noFlex">
            <FileUpload
              v-model="merchantForm!.workPlaceRentUrl"
              :file-size="1"
              :limit="5"
              :biz-type="'workPlaceRentUrl'"
              :file-type-upload="'workPlaceRentUrl'"
            />
            <div class="font-size-12px color-#666">最多5张照片</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="分账协议" prop="shareCertificate" class="noFlex">
            <FileUpload
              v-model="merchantForm!.shareCertificate"
              :file-size="1"
              :limit="5"
              :biz-type="'shareCertificate'"
              :file-type-upload="'shareCertificate'"
            />
            <div class="font-size-12px color-#666">最多5张照片</div>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <el-row class="justify-center mt-20px">
      <el-button v-if="activeIndex !== 0" @click="goBack()">上一步</el-button>
      <el-button type="primary" @click="handleSubmit()">保存</el-button>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import type { Action } from "element-plus";
import { Edit, Upload } from "@element-plus/icons-vue";
import { merchantDetailsApi, merchantSaveCommitApi, merchantSaveDetailCommitApi, commitApi } from "@/api/modules/finance";
import type { ResultData } from "@/api/interface";
import { convertIndustry } from "@/utils";
import useEnumsStore from "@/stores/modules/enums";
import { useUserStore } from "@/stores/modules/user";
const enumsStore = useEnumsStore();
const userStore = useUserStore();

const activeIndex = ref(0);
const merchantForm = ref<Partial<any>>({});
merchantForm.value.merchantNum = userStore.userInfo.merchantNum;

const formRuleRef = ref();
const ruleForm = reactive({
  merchantShortName: [{ required: true, message: "必填" }],
  merchantAddress: [{ required: true, message: "必填" }],
  areaCode: [{ required: true, message: "必填" }],
  bankCode: [{ required: true, message: "必填" }],
  bankName: [{ required: true, message: "必填" }],
  bankOpenName: [{ required: true, message: "必填" }],
  lawPersonTelephone: [
    { required: true, message: "必填" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ],
  bankCardNumber: [{ required: true, message: "必填" }]
});
const cascaderRef = ref(null);
const areaCode = ref<any>([]);
const allOptions = ref<any>([]); // 存储从接口获取的全部数据
const displayedOptions = ref<any>([]); // 存储当前显示给用户的选项
const bankOptions = ref<any>([]);
allOptions.value = enumsStore.bankListComps;
const newOptions = allOptions.value.slice(0, 50);
displayedOptions.value.push(...newOptions);
bankOptions.value = displayedOptions.value;
const industry = ref<any>([]);
const industryType = ref<any>(convertIndustry(enumsStore.industryTypeComps));

const getMerchantDetails = async () => {
  const res: ResultData = await merchantDetailsApi({ id: userStore.userInfo.id });
  merchantForm.value = Object.assign(merchantForm.value, res.data);
  if (res.data.provinceCode && res.data.cityCode && res.data.areaCode) {
    areaCode.value = [res.data.provinceCode, res.data.cityCode, res.data.areaCode];
  }
  if (res.data.mccCode) {
    enumsStore.industryTypeComps.map(item => {
      if (item.mccCode === res.data.mccCode) {
        industry.value = [item.mccLevel1Name, item.mccLevel2Name, item.mccCode];
      }
    });
  }
  const fileTypeMap = {
    legalLicenceFrontUrl: "legalLicenceFrontUrl",
    legalLicenceBackUrl: "legalLicenceBackUrl",
    licenceUrl: "licenceUrl",
    openAccountLicenceUrl: "openAccountLicenceUrl",
    legalPersonFrontUrl: "legalPersonFrontUrl",
    handLicenceUrl: "handLicenceUrl",
    businessPlacePhotoUrl: "businessPlacePhotoUrl",
    icpCertificationUrl: "icpCertificationUrl",
    openAccountVideoUrl: "openAccountVideoUrl",
    businessScene: "businessScene",
    scenePhotoUrl: "scenePhotoUrl",
    agreementPhotoUrl: "agreementPhotoUrl",
    pcScreenshotOfPaymentProcessUrl: "pcScreenshotOfPaymentProcessUrl",
    workPlaceRentUrl: "workPlaceRentUrl",
    shareCertificate: "shareCertificate"
  };

  if (res.data.merchantFiles?.length > 0) {
    res.data.merchantFiles.map(item => {
      if (fileTypeMap[item.fileType]) {
        const propertyName = fileTypeMap[item.fileType];
        if (!Array.isArray(merchantForm.value[propertyName])) {
          merchantForm.value[propertyName] = [];
        }
        merchantForm.value[propertyName].push({ url: item.filePath, id: item.id });
      }
    });
  }
};
getMerchantDetails();

const changeBankName = label => {
  merchantForm.value.bankName = label;
  if (label === "") {
    bankOptions.value = displayedOptions.value;
  }
};

const handleChange = value => {
  merchantForm.value.provinceCode = value[0];
  merchantForm.value.cityCode = value[1];
  merchantForm.value.areaCode = value[2];
  merchantForm.value.provinceName = enumsStore.getProvinceName(value[0]);
  merchantForm.value.cityName = enumsStore.getCityName(value[0], value[1]);
  merchantForm.value.areaName = enumsStore.getCountyName(value[0], value[1], value[2]);
};

const industryTypeChange = value => {
  console.log(value);
  merchantForm.value.mccCode = value[2];
};

const remoteSearch = query => {
  if (query !== "") {
    setTimeout(() => {
      bankOptions.value = allOptions.value.filter(item => {
        return item.bankName.indexOf(query) > -1;
      });
    }, 200);
  }
};

const dateFormat = dateStr => {
  if (!dateStr) return;
  const year = dateStr.toString().slice(0, 4);
  const month = dateStr.toString().slice(4, 6);
  const day = dateStr.toString().slice(6, 8);
  return `${year}年${month}月${day}日`;
};

const goBack = () => {
  activeIndex.value = activeIndex.value - 1;
};

const handleSubmit = () => {
  formRuleRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      if (activeIndex.value === 0) {
        const res: ResultData = await merchantSaveCommitApi(merchantForm.value);
        ElMessage.success({ message: `${res.msg}` });
        activeIndex.value = 1;
      } else if (activeIndex.value === 1) {
        const res: ResultData = await merchantSaveDetailCommitApi(merchantForm.value);
        ElMessage.success({ message: `${res.msg}` });
        activeIndex.value = 2;
      } else if (activeIndex.value === 2) {
        ElMessageBox.alert("材料提交后不可以修改，确定提交吗？", "提示", {
          confirmButtonText: "提交",
          callback: (action: Action) => {
            if (action === "confirm") {
              commitApi({
                merchantNum: userStore.userInfo.merchantNum
              }).then((res: ResultData) => {
                ElMessage.success({ message: `${res.msg}` });
              });
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
};
</script>

<style scoped>
:deep(.el-upload--picture-card),
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 280px;
}
:deep(.noFlex .el-form-item__content) {
  display: block;
}
</style>
