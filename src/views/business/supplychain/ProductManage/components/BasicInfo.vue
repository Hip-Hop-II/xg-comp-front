<template>
  <div class="w-xl mt-5">
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-suffix=":" :label-width="120" size="large">
      <el-form-item label="商品分类" prop="classifyId">
        <el-cascader
          v-model="classifyIds"
          class="w-full"
          placeholder="请选择商品分类"
          :options="dataSource"
          :props="{ value: 'id', label: 'classifyName', children: 'respList', expandTrigger: 'hover' }"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplyNum">
        <el-select v-model="formData.supplyNum" placeholder="请选择供应商" filterable>
          <el-option v-for="s in suppliers" :key="s.merchantNum" :label="s.merchantName" :value="s.merchantNum" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="商品简述" prop="goodsRemark">
        <el-input
          v-model="formData.goodsRemark"
          type="textarea"
          placeholder="请输入商品简述"
          :rows="4"
          :maxlength="100"
          resize="none"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存，下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, shallowRef, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { addGoodsFirstInfo, getSupplyListApi, queryProductCategoryList } from "@/api/modules/business";
import { findCategoryByKey } from "@/utils";

interface BasicInfoForm {
  id?: string;
  supplyNum: string;
  classifyId: string;
  classifyName: string;
  goodsName: string;
  goodsRemark: string;
}

const suppliers = shallowRef<Inventory.ManufacturerMerchants[]>([]);
const dataSource = ref<BusinessSpace.ProductCategory[]>([]);
const ruleFormRef = ref<FormInstance>();
const classifyIds = shallowRef<string[]>([]);
const formData = reactive<BasicInfoForm>({
  supplyNum: "",
  classifyId: "",
  classifyName: "",
  goodsName: "",
  goodsRemark: ""
});
const rules = reactive<FormRules<typeof formData>>({
  classifyId: [{ required: true, message: "请选择商品分类", trigger: "change" }],
  supplyNum: [{ required: true, message: "请选择供应商", trigger: "change" }],
  goodsName: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  goodsRemark: [{ required: true, message: "请输入商品简述", trigger: "blur" }]
});
const onSubmit = async () => {
  try {
    await ruleFormRef.value?.validate();
    await addGoodsFirstInfo(formData);
  } catch (error) {}
};
const handleChange = (values: string[]) => {
  formData.classifyId = values[values.length - 1];
  formData.classifyName = findCategoryByKey(dataSource.value, "id", values[values.length - 1])!.classifyName;
};
onMounted(async () => {
  dataSource.value = await queryProductCategoryList("goods");
  getSupplyListApi().then(res => {
    suppliers.value = res.data;
  });
});
</script>
