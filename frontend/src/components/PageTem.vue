<script setup lang="ts">
  import { useApp } from '@/stores/app'
  const appStore = useApp()

</script>

<template>
  <v-sheet class="pa-1 rounded-lg" height="calc(100vh - 16px)">
    <!-- 工具按钮区域 -->
    <v-sheet class="pl-1 pr-1 pt-1 d-flex justify-space-between mb-2">
      <!-- 左侧按钮组 -->
      <v-btn-group divided variant="outlined">
        <v-btn icon="mdi-menu" @click="appStore.isSiderOpen = !appStore.isSiderOpen" />
        <slot name="tool-prepend" />
      </v-btn-group>

      <!-- 右侧按钮组 -->
      <v-btn-group divided variant="outlined">
        <slot name="tool-append" />
      </v-btn-group>
    </v-sheet>

    <!-- 主要内容区域 -->
    <v-sheet height="calc(100% - 56px)">
      <slot name="page-content" />
    </v-sheet>
  </v-sheet>
</template>

<style scoped lang="scss">
</style>
