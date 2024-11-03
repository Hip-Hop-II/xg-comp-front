<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerProps.title}邀请链接`">
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <div v-if="drawerProps.title === '查看'">
        <el-form-item label="邀请码">
          <img :src="imgCode" style="width: 240px; height: 240px" />
        </el-form-item>
        <el-form-item label="账号">{{ drawerProps.row!.loginName }}</el-form-item>
        <el-form-item label="密码">{{ drawerProps.row!.password }}</el-form-item>
      </div>
      <div v-else>
        <el-form-item label="被邀请方昵称" prop="inviteName">
          <el-input v-model="drawerProps.row!.inviteName" clearable></el-input>
        </el-form-item>
        <el-form-item label="被邀请方类型" prop="inviteType">
          <el-radio-group v-model="drawerProps.row!.inviteType">
            <el-radio v-for="item in SubMerType || []" :key="item.type" :value="item.type">
              {{ item.value }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级关联方名称" prop="parentMerchantNum">
          <el-select v-model="drawerProps.row!.parentMerchantNum" clearable>
            <el-option v-for="item in ParentMer" :key="item.merchantNum" :label="item.merchantName" :value="item.merchantNum" />
          </el-select>
        </el-form-item>
        <el-form-item label="被邀请方角色" prop="roleId">
          <el-radio-group v-model="drawerProps.row!.roleId">
            <el-radio v-for="item in SubMerRole || []" :key="item.roleId" :value="item.roleId">
              {{ item.roleName }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="被邀请方手机号" prop="telephone">
          <el-input v-model="drawerProps.row!.telephone" type="tel" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="邀请链接有效期" prop="inviteValidity">
          <el-input-number v-model="drawerProps.row!.inviteValidity" :min="1" class="mr-2" /> 天
        </el-form-item>
        <el-form-item label="邀请人" prop="inviteUserName">
          <el-input v-model="drawerProps.row!.inviteUserName" clearable></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="drawerProps.row!.loginName" clearable placeholder="请输入登录名" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="drawerProps.row!.password"
            autocomplete="new-password"
            clearable
            type="password"
            minlength="6"
            placeholder="请输入密码"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";

import { subMerInviteParentMerApi, subMerRolesApi, subMerInviteDetailApi } from "@/api/modules/person";
import { useUserStore } from "@/stores/modules/user";
import type { ResultData } from "@/api/interface";
import { copyText, ArrayToObject } from "@/utils/index";
import codeImgTest from "@/assets/images/test.jpg";
import codeImgProd from "@/assets/images/prod.jpg";

const imgCode = import.meta.env.VITE_USER_NODE_ENV === "production" ? codeImgProd : codeImgTest;

const userStore = useUserStore();
const { SubMerType } = userStore.dataType;

const SubMerRole: any = ref([]);
const SubMerRoleMap = ref({});
const ParentMer: any = ref([]);
const getParentMer = async () => {
  const res: ResultData = await subMerInviteParentMerApi({
    pageNum: 1,
    pageSize: 100
  });
  ParentMer.value = res.data || [];

  const resData: ResultData = await subMerRolesApi({});
  SubMerRole.value = resData.data;
  SubMerRoleMap.value = ArrayToObject(SubMerRole.value, "roleId", "roleName");
  console.log(SubMerRoleMap.value);

  if (drawerProps.value.title !== "创建") {
    const resObj: ResultData = await subMerInviteDetailApi({ id: drawerProps.value.row.id });
    drawerProps.value.row = resObj.data;
  }
};

const rules = reactive({
  inviteName: [{ required: true, message: "必填" }],
  inviteType: [{ required: true, message: "必填" }],
  roleId: [{ required: true, message: "必填" }],
  // telephone: [
  //   { required: true, message: "必填" },
  //   {
  //     pattern: /^1[3-9]\d{9}$/,
  //     message: "请输入正确的手机号",
  //     trigger: "blur"
  //   }
  // ],
  loginName: [{ required: true, message: "必填" }],
  password: [{ required: true, message: "必填" }],
  inviteValidity: [{ required: true, message: "必填" }]
});

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
  getParentMer();
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      drawerProps.value.row.roleName = SubMerRoleMap[drawerProps.value.row.roleId];
      const params = {
        ...drawerProps.value.row,
        roleName: SubMerRoleMap.value[drawerProps.value.row.roleId]
      };
      const res: ResultData = await drawerProps.value.api!(params);
      ElMessageBox.confirm(
        `<div style="margin-bottom: 20px;">
          <div>请将以下链接发送至被邀请人，</div>
          <div>由被邀请人完成后内容填写以及实名认证</div>
        </div>
          <div style="margin-bottom: 20px;text-align: center;">
            <img style="width: 150px;height:150px"
            src="${process.env.VITE_USER_NODE_ENV === "production" ? codeImgProd : codeImgTest}"/>
          </div>`,
        "消息",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "",
          showCancelButton: false,
          type: "info",
          center: true
        }
      )
        .then(() => {
          copyText(res.data?.url);
        })
        .catch(() => {
          // catch error
        });
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
