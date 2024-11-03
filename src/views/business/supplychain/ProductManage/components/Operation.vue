<template>
  <div class="mt-5 pl-10">
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" size="large" label-position="top">
      <el-form-item style="margin-bottom: 0">
        <template #label>
          <div class="text-lg font-medium text-black">分润规则</div>
        </template>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <div>规则名称：分润规则123</div>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <div>起止时间：2024-05-01 00:00:00 至 2024-12-31 23:59:59</div>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">规则简述：</el-form-item>
      <el-form-item>
        <el-table :data="tableData" border>
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </el-form-item>
      <el-divider />
      <el-form-item style="margin-bottom: 0">
        <template #label>
          <div class="text-lg font-medium text-black">运费模版</div>
        </template>
      </el-form-item>
      <el-form-item label="模版名称：" prop="freightTemplateId">
        <el-select v-model="formData.freightTemplateId" placeholder="请选择模版" filterable style="width: 400px">
          <el-option v-for="status in [] as any[]" :key="status.value" :label="status.label" :value="status.value as string" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-table :data="tableData" border>
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </el-form-item>
      <el-divider />
      <el-form-item style="margin-bottom: 0">
        <template #label>
          <div class="text-lg font-medium text-black">赠送规则</div>
        </template>
      </el-form-item>
      <el-form-item label="积分方式：" prop="payPointsRuleType">
        <el-radio-group v-model="formData.payPointsRuleType">
          <el-radio value="0">固定值</el-radio>
          <el-radio value="1">价格百分比</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="formData.payPointsRuleType === '0' ? '积分固定值' : '积分百分比'" prop="payPointsRuleValue">
        <el-input-number :min="0" style="width: 200px" v-model="formData.payPointsRuleValue" />
      </el-form-item>
      <el-form-item label="现金方式：" prop="payCashRuleType">
        <el-radio-group v-model="formData.payCashRuleType">
          <el-radio value="0">固定值</el-radio>
          <el-radio value="1">价格百分比</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="formData.payCashRuleType === '0' ? '现金固定值：' : '现金百分比：'" prop="payCashRuleValue">
        <el-input-number :min="0" style="width: 200px" v-model="formData.payCashRuleValue" />
      </el-form-item>
      <ul class="pl-0 text-sm">
        <li class="list-none">1.用户确认收货后内将积分、现金下发至用户积分账户中</li>
        <li class="list-none">2.用户退款后，积分和现金原样扣除</li>
        <li class="list-none">3.默认为不赠送，为固定值=0</li>
        <li class="list-none">4.价格百分比：四舍五入</li>
      </ul>
      <el-divider />
      <el-form-item style="margin-bottom: 0">
        <template #label>
          <div class="text-lg font-medium text-black">抵扣规则</div>
        </template>
      </el-form-item>
      <el-form-item label="积分方式：" prop="deductionPointsRuleType">
        <el-radio-group v-model="formData.deductionPointsRuleType">
          <el-radio value="fix">固定值</el-radio>
          <el-radio value="rate">价格百分比</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="formData.deductionPointsRuleType === 'fix' ? '积分固定值：' : '积分百分比：'"
        prop="deductionPointsRuleValue"
      >
        <el-input-number :min="0" style="width: 200px" v-model="formData.deductionPointsRuleValue" />
      </el-form-item>
      <el-form-item label="现金方式：" prop="deductionCashRuleType">
        <el-radio-group v-model="formData.deductionCashRuleType">
          <el-radio value="fix">固定值</el-radio>
          <el-radio value="rate">价格百分比</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="formData.deductionCashRuleType === 'fix' ? '现金固定值' : '现金百分比'" prop="deductionCashRuleValue">
        <el-input-number :min="0" style="width: 200px" v-model="formData.deductionCashRuleValue" />
      </el-form-item>
      <ul class="pl-0 text-sm">
        <li class="list-none">1.用户购买本商品，最高可以抵扣积分、现金</li>
        <li class="list-none">2.用户退款后，积分、现金原样返还</li>
        <li class="list-none">3.不抵扣，为固定值=0</li>
        <li class="list-none">4.价格百分比：四舍五入</li>
      </ul>
      <el-divider />
      <el-form-item style="margin-bottom: 0">
        <template #label>
          <div class="text-lg font-medium text-black">促销</div>
        </template>
      </el-form-item>
      <el-form-item label="是否热销：" prop="sellHot">
        <el-radio-group v-model="formData.sellHot">
          <el-radio value="0">否</el-radio>
          <el-radio value="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="虚拟销量：" prop="virtuallyCount">
        <el-input-number :min="0" style="width: 200px" v-model="formData.virtuallyCount" />
      </el-form-item>
      <el-form-item>
        <el-button>上一步</el-button>
        <el-button type="primary" @click="onSubmit">发布</el-button>
        <el-button type="success">预览</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { addGoodsFirstInfo } from "@/api/modules/business";

interface FormData {
  freightTemplateId: number | undefined;
  freightTemplateName: string;
  payPointsRuleType: string;
  payPointsRuleValue: number;
  payCashRuleType: string;
  payCashRuleValue: number;
  deductionPointsRuleType: string;
  deductionPointsRuleValue: number;
  deductionCashRuleType: string;
  deductionCashRuleValue: number;
  sellHot: string;
  virtuallyCount: number;
}

const tableData = ref([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
]);
const ruleFormRef = ref<FormInstance>();
const formData = reactive<FormData>({
  freightTemplateId: undefined,
  freightTemplateName: "",
  payPointsRuleType: "0",
  payPointsRuleValue: 0,
  payCashRuleType: "0",
  payCashRuleValue: 0,
  deductionPointsRuleType: "fix",
  deductionPointsRuleValue: 0,
  deductionCashRuleType: "fix",
  deductionCashRuleValue: 0,
  sellHot: "0",
  virtuallyCount: 0
});
const rules = reactive<FormRules<typeof formData>>({
  freightTemplateId: [{ required: true, message: "请选择运费模版", trigger: "change" }],
  payPointsRuleValue: [{ required: true, message: "赠送积分不能为空", trigger: "blur" }],
  payCashRuleValue: [{ required: true, message: "赠送现金不能为空", trigger: "blur" }],
  deductionPointsRuleValue: [{ required: true, message: "抵扣积分不能为空", trigger: "blur" }],
  deductionCashRuleValue: [{ required: true, message: "抵扣现金不能为空", trigger: "blur" }],
  virtuallyCount: [{ required: true, message: "虚拟销量不能为空", trigger: "blur" }]
});
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await addGoodsFirstInfo(formData);
    ruleFormRef.value?.resetFields();
  } catch (error) {}
};
</script>
