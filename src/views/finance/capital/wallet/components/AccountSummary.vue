<template>
  <el-form label-width="150px" label-suffix=" :" :model="rowObj" class="pt-20px card">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-row :gutter="15" class="mb-10px">现金账户</el-row>
        <el-form-item label="总金额"></el-form-item>
        <el-form-item label="可用金额"></el-form-item>
        <el-form-item label="冻结金额"></el-form-item>
        <el-form-item label="售后中金额"></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="15" class="mb-10px">积分账户</el-row>
        <el-form-item label="积分总额"></el-form-item>
        <el-form-item label="可用积分"></el-form-item>
        <el-form-item label="冻结积分"></el-form-item>
        <el-form-item label="售后中积分"></el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref } from "vue";

const rowObj = ref({
  id: 121234234
});
</script>
