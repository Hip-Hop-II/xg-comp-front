<template>
  <div class="footer flx-center">
    <a href="" target="_blank">{{ new Date().getFullYear() }} © {{ title }} By Technology. </a>
  </div>
</template>

<script setup lang="ts" name="Footer">
const title = import.meta.env.VITE_GLOB_APP_TITLE;
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
