<script setup lang="ts">
  import type { Extension } from '@codemirror/state'
  import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
  import { javascript } from '@codemirror/lang-javascript'
  import { json } from '@codemirror/lang-json'
  import { sql } from '@codemirror/lang-sql'
  import {
    bracketMatching, defaultHighlightStyle, foldGutter,
    foldKeymap, indentOnInput, syntaxHighlighting,
  } from '@codemirror/language'
  import { EditorState } from '@codemirror/state'
  import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view'
  import { defineEmits, defineProps, onMounted, onUnmounted, ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '{\n  "name": "Alice",\n  "age": 25,\n  "isStudent": false\n}',
    },
    language: {
      type: String,
      default: 'json',
    },
    // 新增 extensions 属性，允许父组件传入额外的 CodeMirror 扩展
    extensions: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const editorContainer = ref(null)
  let editorView: EditorView = null as any

  defineExpose({
    editorView,
  })

  onMounted(() => {
    let languageExtension
    if (props.language === 'json') {
      languageExtension = json()
    } else if (props.language === 'sql') {
      languageExtension = sql()
    } else {
      languageExtension = javascript()
    }

    const extensions: Extension[] = [
      // 历史记录
      history(),
      // 显示行号
      lineNumbers(),
      // 当前行高亮
      highlightActiveLine(),
      // 当前行号高亮
      highlightActiveLineGutter(),
      // 输入时自动根据语法进行缩进
      indentOnInput(),
      // 使用默认样式进行语法高亮
      syntaxHighlighting(defaultHighlightStyle),
      // 高亮显示匹配的括号
      bracketMatching(),
      // 显示代码折叠标记侧边栏
      foldGutter(),
      // 配置快捷键
      keymap.of([
        // 默认快捷键
        ...defaultKeymap,
        // 历史记录快捷键
        ...historyKeymap,
        // Tab缩进
        indentWithTab,
      ]),
      // 添加内容变化监听
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const doc = update.state.doc.toString()
          emit('update:modelValue', doc)
        }
      }),
      // 新增：父组件传入的额外扩展
      ...props.extensions as Extension[],
    ]

    // 只有当 languageExtension 存在时才添加到扩展中
    if (languageExtension) {
      extensions.push(languageExtension)
    }

    const startState = EditorState.create({
      doc: props.modelValue,
      extensions,
    })

    editorView = new EditorView({
      state: startState,
      parent: editorContainer.value as any,
    })
  })

  // 监听 modelValue 变化，更新编辑器内容
  watch(() => props.modelValue, newValue => {
    if (editorView) {
      const currentValue = editorView.state.doc.toString()
      if (newValue !== currentValue) {
        editorView.dispatch({
          changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: newValue,
          },
        })
      }
    }
  })

  onUnmounted(() => {
    if (editorView) {
      editorView.destroy()
    }
  })
</script>

<template>
  <div>
    <div ref="editorContainer" />
  </div>
</template>

<style>
/* 基础样式 */
.cm-editor {
  height: 100%;
  width: 100%;
}

.cm-editor.cm-focused {
  outline: none;
}
</style>
