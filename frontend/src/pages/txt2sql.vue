<script setup lang="ts">
  import { computed, ref } from 'vue'

  function formatToSQLIn (data: string) {
    // 按行分割数据，并过滤空行
    const lines = data.split('\n').filter(line => line.trim() !== '')

    const formattedValues = lines.map(line => `'${line.trim()}'`).join(', ')

    const sqlIn = `(${formattedValues})`

    return sqlIn
  }

  const row = ref('')

  const sql = computed(() => {
    return formatToSQLIn(row.value)
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
          <v-col class="pa-0 pr-1 h-100 overflow-y-auto overflow-x-hidden" cols="6">
            <v-sheet>
              <CodeMirror v-model="row" />
            </v-sheet>
          </v-col>

          <!-- 右侧 -->
          <v-col class="pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden" cols="6">
            <v-sheet>
              <CodeMirror v-model="sql" language="sql" />
            </v-sheet>

          </v-col>
        </v-row>
      </v-container>
    </template>
  </PageTem>

</template>
