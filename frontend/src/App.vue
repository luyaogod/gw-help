<script lang="ts" setup>
</script>

<template>
  <layout>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </layout>

</template>

<style lang="scss" scoped>

</style>
