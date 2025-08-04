<script setup>
  import {
    defaultKeymap, history, historyKeymap, indentWithTab,
  } from '@codemirror/commands'
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

  const emit = defineEmits(['update:modelValue'])
  const editorContainer = ref(null)
  let editorView = null

  // 1. 定义标记效果类型
  const markEffect = StateEffect.define({
    map: (value, mapping) => ({
      from: mapping.mapPos(value.from),
      to: mapping.mapPos(value.to),
    }),
  })

  // 定义清除所有标记的效果类型
  const clearMarksEffect = StateEffect.define()

  // 2. 创建标记装饰器 - 移除了内联样式
  const markDecoration = Decoration.mark({
    attributes: {
      class: 'cm-marked-text',
    },
  })

  // 3. 创建状态字段管理标记
  const markField = StateField.define({
    create: () => Decoration.none,
    update: (marks, tr) => {
      // 应用效果更新
      marks = marks.map(tr.changes)

      // 处理标记效果
      for (const effect of tr.effects) {
        if (effect.is(markEffect)) {
          marks = marks.update({
            add: [markDecoration.range(effect.value.from, effect.value.to)],
          })
        } else if (effect.is(clearMarksEffect)) {
          // 清除所有标记
          marks = Decoration.none
        }
      }
      return marks
    },
    provide: f => EditorView.decorations.from(f),
  })

  // 5. 标记文本的函数
  function markText (from, to) {
    if (!editorView) return

    editorView.dispatch({
      effects: markEffect.of({ from, to }),
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
    const startState = EditorState.create({
      doc: 'hello mari\no  2025 08 02',
      extensions: [
        history(),
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle),
        bracketMatching(),
        foldGutter(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        markField, // 添加标记扩展
      ],
    })

    editorView = new EditorView({
      state: startState,
      parent: editorContainer.value,
    })
  })

  onUnmounted(() => {
    editorView?.destroy()
  })

  function doMark () {
    markText(6, 12)
  }
</script>

<template>
  <div ref="editorContainer" />
  <button @click="doMark()">mark</button>
  <button @click="clearAllMarks()">clearAllMark</button>
</template>

<style>
.cm-editor {
  height: 100%;
  width: 100%;
}

.cm-editor.cm-focused {
  outline: none;
}

/* 在这里定义标记文本的样式 */
.cm-marked-text {
  background-color: rgba(255, 215, 0, 0.3);
  border-bottom: 2px solid gold;
  border-radius: 2px;
  padding: 0 2px;
}
</style>
