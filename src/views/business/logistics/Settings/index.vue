<template>
  <div>
    <after-sales />
    <div class="grid grid-cols-2 gap-4 mb-2">
      <logistic-comp />
      <recieve-send />
    </div>
    <freight-template />
  </div>
</template>

<script setup lang="ts">
import AfterSales from "./components/AfterSales.vue";
import LogisticComp from "./components/LogisticComp.vue";
import RecieveSend from "./components/RecieveSend.vue";
import FreightTemplate from "./components/FreightTemplate.vue";
</script>
