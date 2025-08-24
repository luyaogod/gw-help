<script setup lang="ts">
  import type { CoderExposes } from '@/components/coder/index.vue'
  import { json } from '@codemirror/lang-json'
  import { EditorView } from '@codemirror/view'
  import { mark } from '@/components/coder/utils/markFile'

  const doc = ref('1234567')
  const coder = ref<CoderExposes>(null as any)

  onMounted(() => {
    mark(coder.value.view, 0, 2, 'cm-diff-remove')

    const markCssExtension = EditorView.baseTheme(
      {
        '.cm-marked-remove': {
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
        },
        '.cm-diff-add': {
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
        },
        '.cm-diff-remove': {
          backgroundColor: 'rgba(255, 215, 0, 0.3)',
        },
      })

    coder.value.addExtensions(
      [markCssExtension],
    )
  })

</script>

<template>
  <Coder ref="coder" v-model="doc" :language="json()" />
</template>

<style scoped lang="scss">
.cm-marked-remove {
  background-color: rgba(255, 0, 0, 0.2);  /* 浅红色背景表示删除 */
  border-radius: 2px;
  padding: 0 2px;
}
</style>
