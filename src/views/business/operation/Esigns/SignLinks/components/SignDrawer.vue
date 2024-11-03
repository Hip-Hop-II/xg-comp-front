<template>
  <el-drawer v-model="visible" title="发起签约" size="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="formData" label-width="auto" label-suffix=":" size="large" :rules="rules" ref="formRef">
      <el-form-item label="签约名称" prop="taskName">
        <el-input v-model="formData.taskName" style="width: 100%" placeholder="请输入签约名称" />
      </el-form-item>
      <el-form-item label="截止时间" prop="expiresTime">
        <el-date-picker v-model="formData.expiresTime" style="width: 100%" type="date" placeholder="请选择截止时间" />
      </el-form-item>
      <el-form-item label="签约模版" prop="templateId">
        <el-select v-model="formData.templateId" placeholder="请选择签约模版" @change="onTemplateChange">
          <el-option v-for="item in signTemplates" :key="item.id" :label="item.templateName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(item, i) in formData.eleSignUserReqs"
        :label="`签约方${i + 1}`"
        :key="i"
        :prop="'eleSignUserReqs.' + i + '.memberId'"
        :rules="{ required: true, message: `请选择签约方${i + 1}`, trigger: 'change' }"
      >
        <el-select
          v-model="item.memberId"
          :placeholder="`请选择签约${item.signUserType === 'company' ? '公司' : '个人'}`"
          filterable
          @focus="querySignUsers(item.signUserType)"
        >
          <el-option v-for="u in signUsers[item.signUserType]" :key="u.memberId" :label="u.memberName" :value="u.memberId" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { eleSignTaskAddApi, eleSignTemplateListApi, eleSignUserApi, eleSignUserListApi } from "@/api/modules/business";
import dayjs from "dayjs";
import { FormInstance, FormRules } from "element-plus";
import { ref, reactive, shallowRef } from "vue";

interface FormData {
  templateId: string;
  taskName: string;
  expiresTime: string;
  eleSignUserReqs: {
    memberId: string;
    signUserRole: string;
    signUserType: string;
    eleSignUserFieldReqs: BusinessSpace.SignTemplateFileDoc[];
  }[];
}
interface SignUser {
  [key: string]: { memberId: string; memberName: string }[];
}

const formRef = ref<FormInstance>();
const signUsers = ref<SignUser>({});
const signFills = shallowRef<BusinessSpace.SignFill[]>([]);
const visible = ref(false);
const signTemplates = ref<BusinessSpace.SignTemplate[]>([]);
const formData = reactive<FormData>({
  templateId: "",
  taskName: "",
  expiresTime: "",
  eleSignUserReqs: []
});
const rules = reactive<FormRules<Omit<FormData, "eleSignUserReqs">>>({
  templateId: [{ required: true, message: "请选择签约模版", trigger: "change" }],
  taskName: [
    {
      required: true,
      message: "请输入签约名称",
      trigger: "blur"
    }
  ],
  expiresTime: [
    {
      required: true,
      message: "请选择截止时间",
      trigger: "change"
    }
  ]
});

const querySignUsers = async (type: string) => {
  if (!signUsers.value[type]) {
    const res = await eleSignUserListApi({
      signUserType: type
    });
    signUsers.value[type] = res.data || [];
  }
};

const onTemplateChange = async () => {
  const res = await eleSignUserApi({
    id: formData.templateId,
    returnUrl: window.location.href
  });
  signFills.value = res.data || [];
  formData.eleSignUserReqs = signFills.value.map((item: BusinessSpace.SignFill) => ({
    memberId: "",
    signUserType: item.signUserType,
    signUserRole: item.signUserRole,
    eleSignUserFieldReqs: item.fileDocs
  }));
};

const onSubmit = async () => {
  try {
    await formRef.value?.validate();
    const res = await eleSignTaskAddApi({
      ...formData,
      expiresTime: new Date(dayjs(formData.expiresTime).format("YYYY-MM-DD") + " 23:59:59").getTime(),
      returnUrl: window.location.href
    });
    if (res.data.authType === "faDaDa") {
      window.location.href = res.data.url;
    }
  } catch (error) {}
};

defineExpose({
  async open() {
    formRef.value?.resetFields();
    formData.templateId = "";
    formData.taskName = "";
    formData.expiresTime = "";
    formData.eleSignUserReqs = [];
    const res = await eleSignTemplateListApi();
    signTemplates.value = res.data || [];
    visible.value = true;
  }
});
</script>
