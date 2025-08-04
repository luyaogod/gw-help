<script setup lang="ts">
  import { computed, ref } from 'vue'

  const docJsonRow = ref('{"message": "hello world!"}') // 默认给一个合法的 JSON

  const docJsonFormatted = computed(() => {
    try {
      if (!docJsonRow.value.trim()) return '' // 空内容处理
      const parsed = JSON.parse(docJsonRow.value) // 使用标准 JSON 解析
      return JSON.stringify(parsed, null, 2) // 格式化输出（缩进 2 个空格）
    } catch (error: any) {
      return `JSON 解析错误: ${error.message}`
    }
  })

</script>

<template>
  <PageTem>
    <template #tool-prepend>
      <!-- 运行按钮 -->
      <!-- <v-btn icon="mdi-play" @click="play()" /> -->
    </template>
    <template #tool-append>
      <!-- 复制结果 -->
      <!-- <v-btn icon="mdi-content-copy" size="small" /> -->
    </template>
    <template #page-content>
      <v-container class="pa-0 mt-1" fluid height="100%">
        <v-row class="h-100  ma-0">
          <!-- 左侧 -->
          <v-col cols="6 pa-0 pr-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-sheet>
              <CodeMirror v-model="docJsonRow" language="js" />
            </v-sheet>
          </v-col>

          <!-- 右侧 -->
          <v-col cols="6 pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-sheet>
              <CodeMirror v-model="docJsonFormatted" language="js" />
            </v-sheet>

          </v-col>
        </v-row>
      </v-container>
    </template>
  </PageTem>

</template>
