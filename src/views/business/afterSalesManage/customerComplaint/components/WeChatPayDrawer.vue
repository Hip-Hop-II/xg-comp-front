<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :disabled="drawerProps.isView"
      :hide-required-asterisk="drawerProps.isView"
    >
      <template v-if="drawerProps.title === '查看'">
        <el-form-item label="操作流水号">
          <el-input v-model="drawerProps.row!.logId" />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="drawerProps.row!.operator" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="drawerProps.row!.operateType">
            <el-option
              v-for="item in SubMerList"
              :key="item.merchantNum"
              :label="item.merchantName + '-' + item.merchantNum"
              :value="item.merchantNum"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作内容">
          <el-input v-model="drawerProps.row!.operateDetails" :rows="3" type="textarea" />
        </el-form-item>
        <el-form-item label="投诉协商记录">
          <!-- imageList -->
        </el-form-item>
        <el-form-item label="投诉资料">
          <!-- complaintMediaList -->
        </el-form-item>
      </template>

      <template v-if="drawerProps.title === '处理投诉'">
        <el-form-item label="被诉商户微信号" prop="complaintedMchId">
          <el-input v-model="drawerProps.row!.complaintedMchId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="微信商户号" prop="mchId">
          <el-input v-model="drawerProps.row!.mchId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="支付通道类型">
          <el-select v-model="drawerProps.row!.channelType" placeholder="请选择">
            <el-option
              v-for="item in SubMerList"
              :key="item.merchantNum"
              :label="item.merchantName + '-' + item.merchantNum"
              :value="item.merchantNum"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="drawerProps.row!.jumpUrl" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="跳转链接⽂案">
          <el-input v-model="drawerProps.row!.jumpUrlText" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="投诉处理⽅案">
          <el-input
            v-model="drawerProps.row!.responseContent"
            :rows="3"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="回复内容,具体的投诉处理⽅案，限制200个字符以内"
          />
        </el-form-item>
        <el-form-item label="投诉处理凭证"></el-form-item>
      </template>

      <template v-if="drawerProps.title === '投诉反馈'">
        <el-form-item label="被诉商户微信号" prop="complaintedMchId">
          <el-input v-model="drawerProps.row!.complaintedMchId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="微信商户号" prop="mchId">
          <el-input v-model="drawerProps.row!.mchId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="支付通道类型">
          <el-select v-model="drawerProps.row!.channelType" placeholder="请选择">
            <el-option
              v-for="item in SubMerList"
              :key="item.merchantNum"
              :label="item.merchantName + '-' + item.merchantNum"
              :value="item.merchantNum"
            />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="drawerProps.title === '退款'">
        <el-form-item label="微信商户号" prop="mchId">
          <el-input v-model="drawerProps.row!.mchId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="支付通道类型">
          <el-select v-model="drawerProps.row!.channelType" placeholder="请选择">
            <el-option
              v-for="item in SubMerList"
              :key="item.merchantNum"
              :label="item.merchantName + '-' + item.merchantNum"
              :value="item.merchantNum"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="退款" prop="action">
          <el-radio-group v-model="drawerProps.row!.action">
            <el-radio :value="1">同意</el-radio>
            <el-radio :value="0">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因" prop="rejectReason" :required="drawerProps.row.action === 0">
          <el-input v-model="drawerProps.row!.rejectReason" :rows="5" type="textarea" placeholder="请输入原因" />
        </el-form-item>
        <el-form-item label="退款发起时间" prop="launchRefundDay" :required="drawerProps.row.action === 0">
          <el-date-picker
            v-model="drawerProps.row!.launchRefundDay"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="拒绝退款的举证图⽚">
          <!-- rejectMediaList -->
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="drawerProps.row!.remark" :rows="5" type="textarea" placeholder="请输入原因" />
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="drawerProps.title !== '查看'" type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { ResultData } from "@/api/interface";
import { weChatComplaintDetailApi } from "@/api/modules/business";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
console.log(1111, userStore.dataType);

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
  complaintId: [{ required: true, message: "必填" }],
  complaintedMchId: [{ required: true, message: "必填" }],
  mchId: [{ required: true, message: "必填" }],
  channelType: [{ required: true, message: "必填" }],
  action: [{ required: true, message: "必填" }],
  rejectReason: [{ required: true, message: "必填" }],
  launchRefundDay: [{ required: true, message: "必填" }]
});

const getDetail = () => {
  weChatComplaintDetailApi({
    complaintId: drawerProps.value.row.complaintId
  }).then((res: ResultData) => {
    drawerProps.value.row = res.data;
  });
};

const SubMerList = ref<any>([]);

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.title === "查看" || drawerProps.value.title === "审核") {
    drawerProps.value.isView = true;
    getDetail();
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
      params.toMerchantNum = userStore.userInfo.merchantNum;
      params.fromAccountId = drawerProps.value.row.fromAccount.id;
      console.log(params);
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
