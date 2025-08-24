<script setup lang="ts">
  import type { ComputedRef, Ref, ShallowRef } from 'vue'
  import { EditorState, type Extension, StateEffect, type Text } from '@codemirror/state'
  import { EditorView } from '@codemirror/view'
  import { defineModel, onMounted, ref, shallowRef, watch } from 'vue'
  import { useExtensions, type UseExtensionsOptions } from './hooks/useExtensions'

  export interface CoderProps extends UseExtensionsOptions {}

  export interface CoderExposes {
    view: ShallowRef<EditorView>
    editor: Ref<HTMLElement | undefined>
    extensions: ComputedRef<Extension[]>
    addExtensions: (extensions: Extension[]) => void
    replaceDoc: (doc: string) => void
  }

  const props = defineProps<CoderProps>()
  const code = defineModel<string | Text>({ default: '' })
  const { extensions } = useExtensions(props)
  const editor: Ref<HTMLElement | undefined> = ref()
  const view: ShallowRef<EditorView> = shallowRef(new EditorView())

  onMounted(() => {
    view.value = new EditorView({
      parent: editor.value,
      state: EditorState.create({ doc: code?.value, extensions: extensions.value }),
      dispatchTransactions (trs, view) {
        view.update([...trs])
        code.value = view.state.doc.toString()
      },
    })
  })

  watch(
    code,
    value => {
      if (value !== view.value.state.doc.toString()) {
        view.value.dispatch({
          changes: { from: 0, to: view.value.state.doc.length, insert: value },
        })
      }
    },
    { immediate: true },
  )

  watch(
    extensions,
    extensions => {
      view.value?.dispatch({
        effects: StateEffect.reconfigure.of(extensions),
      })
    },
    { immediate: true },
  )

  function addExtensions (extensions: Extension[]) {
    view.value.dispatch({
      effects: StateEffect.appendConfig.of(extensions),
    })
  }

  function replaceDoc (value: string) {
    view.value.dispatch({
      changes: { from: 0, to: view.value.state.doc.length, insert: value },
    })
  }

  defineExpose<CoderExposes>({
    view,
    editor,
    extensions,
    addExtensions,
    replaceDoc,
  })

</script>

<template>
  <div ref="editor" />
</template>

<style scoped lang="scss">
</style>
