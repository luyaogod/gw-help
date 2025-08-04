<template>
  <div>
    <div ref="editorContainer" />
  </div>
</template>

<script setup lang="ts">
  import type { Extension } from '@codemirror/state'
  import {
    defaultKeymap, history, historyKeymap, indentWithTab,
  } from '@codemirror/commands'
  import { javascript } from '@codemirror/lang-javascript'
  import { json } from '@codemirror/lang-json'
  import {
    bracketMatching, defaultHighlightStyle, foldGutter,
    foldKeymap, indentOnInput, syntaxHighlighting,
  } from '@codemirror/language'
  import { EditorState, StateEffect, StateField } from '@codemirror/state'
  import {
    Decoration, EditorView, highlightActiveLine,
    highlightActiveLineGutter, keymap, lineNumbers,
  } from '@codemirror/view'
  import { defineEmits, onMounted, onUnmounted, ref } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '{\n  "name": "Alice",\n  "age": 25,\n  "isStudent": false\n}',
    },
    language: {
      type: String,
      default: 'json',
    },
    extensions: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const editorContainer = ref(null)
  let editorView: EditorView = null as any

  interface MarkEffectValue {
    from: number
    to: number
    className: string
  }

  const markEffect = StateEffect.define<MarkEffectValue>({
    map: (value: MarkEffectValue, mapping) => ({
      from: mapping.mapPos(value.from),
      to: mapping.mapPos(value.to),
      className: value.className,
    }),
  })

  const clearMarksEffect = StateEffect.define()

  const markDecoration = (className: string) => Decoration.mark({
    attributes: {
      class: className,
    },
  })

  const markField = StateField.define({
    create: () => Decoration.none,
    update: (marks, tr) => {
      marks = marks.map(tr.changes)

      for (const effect of tr.effects) {
        if (effect.is(markEffect)) {
          marks = marks.update({
            add: [markDecoration(effect.value.className).range(effect.value.from, effect.value.to)],
          })
        } else if (effect.is(clearMarksEffect)) {
          marks = Decoration.none
        }
      }
      return marks
    },
    provide: f => EditorView.decorations.from(f),
  })

  // 5. 标记文本的函数
  function markText (from: number, to: number, className: string) {
    if (!editorView) return

    editorView.dispatch({
      effects: markEffect.of({ from, to, className }),
    })
  }

  // 清除所有标记的函数
  function clearAllMarks () {
    if (!editorView) return

    editorView.dispatch({
      effects: clearMarksEffect.of(null),
    })
  }

  onMounted(() => {
    // const languageExtension = props.language === 'json' ? json() : javascript()

    const startState = EditorState.create({
      doc: props.modelValue,
      extensions: [
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
        // 语言扩展
        // languageExtension,
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
        markField,
        ...props.extensions as Extension[],
      ],
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

  defineExpose({
    markText,
    clearAllMarks,
  })

</script>

<style>
/* 基础样式 */
.cm-editor {
  height: 100%;
  width: 100%;
}

.cm-editor.cm-focused {
  outline: none;
}

.cm-marked-remove {
  background-color: rgba(255, 0, 0, 0.2);  /* 浅红色背景表示删除 */
  border-radius: 2px;
  padding: 0 2px;
}

.cm-marked-add {
  background-color: rgba(0, 255, 0, 0.2);  /* 浅绿色背景表示新增 */
  border-radius: 2px;
  padding: 0 2px;
}

.cm-marked-replace {
  background-color: rgba(255, 215, 0, 0.3);  /* 浅黄色背景表示修改 */
  border-radius: 2px;
  padding: 0 2px;
}
</style>
