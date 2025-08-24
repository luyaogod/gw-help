<script setup lang="ts">
  import { sql } from '@codemirror/lang-sql'
  import { useClipboard } from '@vueuse/core'
  import { computed, ref } from 'vue'
  import { useMsg } from '@/uses/useMsg'
  const { msg, setMsg, isShow, showMsg } = useMsg()
  const { copy } = useClipboard()
  function formatToSQLIn (data: string) {
    // 按行分割数据，并过滤空行
    const lines = data.split('\n').filter(line => line.trim() !== '')

    const formattedValues = lines.map(line => `'${line.trim()}'`).join(', ')

    const sqlIn = `(${formattedValues})`

    return sqlIn
  }

  const row = ref('')

  const sqlCode = computed(() => {
    return formatToSQLIn(row.value)
  })

  function clear () {
    row.value = ''
  }

</script>

<template>
  <v-snackbar v-model="isShow" :text="msg" timeout="1000" />
  <PageTem>
    <template #tool-prepend>
      <v-btn @click="clear()">清除</v-btn>
    </template>
    <template #tool-append>
      <v-btn @click="()=>{copy(sqlCode); setMsg('复制成功'); showMsg()}">复制</v-btn>
    </template>
    <template #page-content>
      <v-container class="pa-0 mt-1" fluid height="100%">
        <v-row class="h-100  ma-0">
          <!-- 左侧 -->
          <v-col class="pa-0 pr-1 h-100 overflow-y-auto overflow-x-hidden" cols="6">
            <v-sheet>
              <Coder v-model="row" />
            </v-sheet>
          </v-col>

          <!-- 右侧 -->
          <v-col class="pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden" cols="6">
            <v-sheet>
              <Coder v-model="sqlCode" :language="sql()" />
            </v-sheet>

          </v-col>
        </v-row>
      </v-container>
    </template>
  </PageTem>

</template>
