<script setup lang="ts">
  import type { CoderExposes } from '@/components/coder/index.vue'
  import { json } from '@codemirror/lang-json'
  import { useClipboard } from '@vueuse/core'
  import { parse } from 'jsonc-parser'
  import { useMsg } from '@/uses/useMsg'
  import { sortObject } from '@/utils/sortObj'
  const { msg, setMsg, isShow, showMsg } = useMsg()
  const { copy } = useClipboard()
  const editorL = ref<CoderExposes>(null as any)
  const editorR = ref<CoderExposes>(null as any)
  const docJson5 = ref('')
  const docJson = ref('')
  watch(docJson5, (newVal: any) => {
    try {
      if (!newVal.trim()) {
        docJson.value = '' // 空内容处理
        return
      }
      const parsed = parse(newVal) // 解析 JSON5
      docJson.value = JSON.stringify(parsed, null, 2) // 格式化输出
    } catch {
      docJson.value = `请输入有效的JSON`
    }
  })
  function sortDocJson () {
    const obj = parse(docJson.value)
    const sortedObject = sortObject(obj, true)
    docJson.value = JSON.stringify(sortedObject, null, 2)
  }
</script>

<template>
  <v-snackbar v-model="isShow" :text="msg" timeout="1000" />

  <PageTem>
    <template #tool-prepend>
      <v-btn @click="editorL.replaceDoc('')">清除</v-btn>

      <v-btn @click="()=>{copy(docJson5); setMsg('复制成功'); showMsg()}">复制</v-btn>

    </template>
    <template #tool-append>
      <v-btn @click="editorR.replaceDoc('')">清除</v-btn>
      <v-btn @click="()=>{copy(docJson); setMsg('复制成功'); showMsg()}">复制</v-btn>
      <v-btn @click="sortDocJson()">升序</v-btn>
    </template>
    <template #page-content>
      <ContentSplit>
        <template #left>
          <Coder ref="editorL" v-model="docJson5" :language="json()" />
        </template>
        <template #right>
          <Coder ref="editorR" v-model="docJson" :language="json()" />
        </template>
      </ContentSplit>
    </template>
  </PageTem>

</template>
