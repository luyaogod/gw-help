<script setup lang="ts">
</script>

<template>
  <v-container class="pa-0 mt-1" fluid height="100%">
    <v-row class="h-100  ma-0">
      <!-- 左侧 -->
      <v-col class="pa-1 pr-1 h-100 overflow-y-auto overflow-x-hidden" cols="6">
        <v-sheet>
          <slot name="left" />
        </v-sheet>
      </v-col>

      <!-- 右侧 -->
      <v-col class="pa-1 pl-1 h-100 overflow-y-auto overflow-x-hidden" cols="6">
        <v-sheet>
          <slot name="right" />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
</style>
