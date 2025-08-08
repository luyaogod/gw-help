<script setup lang="ts">
  import { parse } from 'jsonc-parser'
  import { computed, ref } from 'vue'

  const docJson5 = ref('console.log("hello world!")')

  const docJson = computed(() => {
    try {
      if (!docJson5.value.trim()) return '' // 空内容处理
      const parsed = parse(docJson5.value) // 解析 JSON5
      return JSON.stringify(parsed, null, 2) // 格式化输出
    } catch {
      return `请输入有效的JSON5`
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
              <CodeMirror v-model="docJson5" language="js" />
            </v-sheet>
          </v-col>

          <!-- 右侧 -->
          <v-col cols="6 pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-sheet>
              <CodeMirror v-model="docJson" language="js" />
            </v-sheet>

          </v-col>
        </v-row>
      </v-container>
    </template>
  </PageTem>

</template>
