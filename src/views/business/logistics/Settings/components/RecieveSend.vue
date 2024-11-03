<template>
  <div class="bg-white px-4 rounded-md">
    <div class="flex items-center">
      <el-space>
        <el-tooltip effect="dark" content="系统发货后，默认收货天数到达后自动确认收货" placement="top-start">
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
        <h3>默认收货天数：</h3>
      </el-space>
      <el-input size="large" v-model="formData.receiveDay" style="width: 240px" placeholder="请输入1-19的整数">
        <template #append>天</template>
      </el-input>
      <el-button type="primary" size="large" class="ml-4" @click="handleReceiveDay">确定</el-button>
    </div>
    <div class="flex items-center">
      <el-space>
        <el-tooltip effect="dark" content="商品详情页展示“XX小时内发货”" placement="top-start">
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
        <h3>承诺发货时间：</h3>
      </el-space>
      <el-input size="large" v-model="formData.sendHour" style="width: 240px" placeholder="请输入1-999的整数">
        <template #append>小时</template>
      </el-input>
      <el-button type="primary" size="large" class="ml-4" @click="handleSendHour">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { QuestionFilled } from "@element-plus/icons-vue";
import { queryMallConfigurateDetail, setReceiveDay, setSendHour } from "@/api/modules/business";
import { ElMessage } from "element-plus";

interface FormData {
  receiveDay: string;
  sendHour: string;
}

const formData = reactive<FormData>({
  receiveDay: "",
  sendHour: ""
});

const handleReceiveDay = async () => {
  if (/^1\d?$/.test(formData.receiveDay)) {
    await setReceiveDay({ receiveDay: parseInt(formData.receiveDay, 10) });
    ElMessage.success("默认收货天数设置成功");
  } else {
    ElMessage.error("请输入1-19的整数");
  }
};

const handleSendHour = async () => {
  if (/^[1-9]\d{0,2}$/.test(formData.sendHour)) {
    await setSendHour({ sendHour: parseInt(formData.sendHour, 10) });
    ElMessage.success("承诺发货时间设置成功");
  } else {
    ElMessage.error("请输入1-999的整数");
  }
};

onMounted(() => {
  queryMallConfigurateDetail();
});
</script>
