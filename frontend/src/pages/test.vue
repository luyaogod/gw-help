<!-- <script setup lang="ts">
// 学习codemirror如何创建和管理装饰器
  import type { DecorationSet } from '@codemirror/view'
  import {
    defaultKeymap, history, historyKeymap,
  } from '@codemirror/commands'
  import {
    bracketMatching, defaultHighlightStyle, foldGutter,
    foldKeymap, indentOnInput, syntaxHighlighting,
  } from '@codemirror/language'
  import {
    highlightSelectionMatches, searchKeymap,
  } from '@codemirror/search'
  import { EditorState, StateEffect, StateField } from '@codemirror/state'
  import {
    crosshairCursor, Decoration, drawSelection,
    dropCursor, EditorView, highlightActiveLine,
    highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection,
  } from '@codemirror/view'

  function createMarkDecoration (className: string) {
    return Decoration.mark({ class: className })
  }

  const underlineMark = Decoration.mark({ class: 'cm-underline' })

  const underlineTheme = EditorView.baseTheme({
    '.cm-underline': { textDecoration: 'underline 3px red' },
  })

  const addUnderline = StateEffect.define<{ from: number, to: number }>({

    map: ({ from, to }, change) => ({ from: change.mapPos(from), to: change.mapPos(to) }),
  })
  const clearUnderlines = StateEffect.define()
  /**
  **/
  const underlineField = StateField.define<DecorationSet>({
    create () {
      return Decoration.none
    },
    update (underlines, tr) {
      let updatedUnderlines = underlines.map(tr.changes)

      for (const effect of tr.effects) {
        if (effect.is(addUnderline)) {
          updatedUnderlines = updatedUnderlines.update({
            add: [underlineMark.range(effect.value.from, effect.value.to)],
          })
        }
        // 添加对清除效果的处理
        if (effect.is(clearUnderlines)) {
          updatedUnderlines = Decoration.none
        }
      }

      return updatedUnderlines
    },
    provide: f => EditorView.decorations.from(f),
  })

  function underlineSelection (view: EditorView) {
    const allSelectionRanges = view.state.selection.ranges
    const nonEmptyRanges = allSelectionRanges.filter(range => !range.empty)
    const effects: StateEffect<unknown>[] = []
    for (const range of nonEmptyRanges) {
      const underlineEffect = addUnderline.of({
        from: range.from,
        to: range.to,
      })
      effects.push(underlineEffect)
    }
    if (effects.length === 0) {
      return false
    }

    if (!view.state.field(underlineField, false))
      effects.push(StateEffect.appendConfig.of([underlineField,
                                                underlineTheme]))

    view.dispatch({ effects })
    return true
  }
  function clearAllUnderlines (view: EditorView) {
    if (!view.state.field(underlineField, false)) {
      return false
    }

    view.dispatch({
      effects: [clearUnderlines.of(null)],
    })
    return true
  }

  const outerlibeKeyMap = [{
    key: 'Mod-h',
    preventDefault: true,
    run: underlineSelection,
  }]

  const clearUnderlinesKeyMap = [{
    key: 'Mod-Shift-h',
    preventDefault: true,
    run: clearAllUnderlines,
  }]

  // 编辑器注册--------------------------------------------------------------------------
  const coder = ref(null)
  let view: EditorView = null as any
  let state: EditorState = null as any

  const extensions = [
    // A line number gutter
    lineNumbers(),
    // A gutter with code folding markers
    foldGutter(),
    // Replace non-printable characters with placeholders
    highlightSpecialChars(),
    // The undo history
    history(),
    // Replace native cursor/selection with our own
    drawSelection(),
    // Show a drop cursor when dragging over the editor
    dropCursor(),
    // Allow multiple cursors/selections
    EditorState.allowMultipleSelections.of(true),
    // Re-indent lines when typing specific input
    indentOnInput(),
    // Highlight syntax with a default style
    syntaxHighlighting(defaultHighlightStyle),
    // Highlight matching brackets near cursor
    bracketMatching(),
    // Allow alt-drag to select rectangular regions
    rectangularSelection(),
    // Change the cursor to a crosshair when holding alt
    crosshairCursor(),
    // Style the current line specially
    highlightActiveLine(),
    // Style the gutter for current line specially
    highlightActiveLineGutter(),
    // Highlight text that matches the selected text
    highlightSelectionMatches(),
    keymap.of([

      // A large set of basic bindings
      ...defaultKeymap,
      // Search-related keys
      ...searchKeymap,
      // Redo/undo keys
      ...historyKeymap,
      // Code folding bindings
      ...foldKeymap,
      // ctrl h
      ...outerlibeKeyMap,
      // 添加清除下划线的快捷键
      ...clearUnderlinesKeyMap,
    ]),
  ]

  onMounted(() => {
    state = EditorState.create({
      doc: 'Start document',
      extensions: extensions,
    })

    view = new EditorView({
      state: state,
      parent: coder.value as any,
    })
  })
</script>

<template>
  <div ref="coder" />
</template>

<style scoped lang="scss">
</style> -->

<script setup lang="ts">
  import type { DecorationSet } from '@codemirror/view'
  import {
    defaultKeymap,
    history,
    historyKeymap,
  } from '@codemirror/commands'
  import {
    bracketMatching,
    defaultHighlightStyle,
    foldGutter,
    indentOnInput,
    syntaxHighlighting,
  } from '@codemirror/language'
  import {
    highlightSelectionMatches,
    searchKeymap,
  } from '@codemirror/search'
  import { EditorState, StateEffect, StateField } from '@codemirror/state'
  import {
    crosshairCursor,
    Decoration,
    drawSelection,
    dropCursor,
    EditorView,
    highlightActiveLine,
    highlightActiveLineGutter,
    highlightSpecialChars,
    keymap,
    lineNumbers,
    rectangularSelection,
  } from '@codemirror/view'

  import { onMounted, ref } from 'vue'

  // ========== 1. 定义三种装饰器 ==========
  function createMarkDecoration (className: string) {
    return Decoration.mark({ class: className })
  }

  const removeMark = createMarkDecoration('cm-marked-remove')
  const deleteMark = createMarkDecoration('cm-diff-delete')
  const addMark = createMarkDecoration('cm-diff-add')

  // ========== 2. 定义主题样式 ==========
  const multiDecorationTheme = EditorView.baseTheme({
    '.cm-marked-remove': {
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      textDecoration: 'line-through red',
    },
    '.cm-diff-delete': {
      backgroundColor: 'rgba(255, 215, 0, 0.3)',
      opacity: 0.8,
    },
    '.cm-diff-add': {
      backgroundColor: 'rgba(0, 255, 0, 0.2)',
      borderLeft: '3px solid #4caf50',
    },
  })

  // ========== 3. 定义添加装饰的 Effect ==========
  const addRemoveMark = StateEffect.define<{ from: number, to: number }>({
    map: (value, change) => ({
      from: change.mapPos(value.from),
      to: change.mapPos(value.to),
    }),
  })

  const addDeleteMark = StateEffect.define<{ from: number, to: number }>({
    map: (value, change) => ({
      from: change.mapPos(value.from),
      to: change.mapPos(value.to),
    }),
  })

  const addAddMark = StateEffect.define<{ from: number, to: number }>({
    map: (value, change) => ({
      from: change.mapPos(value.from),
      to: change.mapPos(value.to),
    }),
  })

  const clearAllMarks = StateEffect.define()

  // ========== 4. 定义 StateField 管理所有装饰 ==========
  const marksField = StateField.define<DecorationSet>({
    create () {
      return Decoration.none
    },

    update (marks, tr) {
      // 映射已有装饰的位置
      let updatedMarks = marks.map(tr.changes)

      // 处理每种添加效果
      for (const effect of tr.effects) {
        if (effect.is(addRemoveMark)) {
          updatedMarks = updatedMarks.update({
            add: [removeMark.range(effect.value.from, effect.value.to)],
          })
        } else if (effect.is(addDeleteMark)) {
          updatedMarks = updatedMarks.update({
            add: [deleteMark.range(effect.value.from, effect.value.to)],
          })
        } else if (effect.is(addAddMark)) {
          updatedMarks = updatedMarks.update({
            add: [addMark.range(effect.value.from, effect.value.to)],
          })
        } else if (effect.is(clearAllMarks)) {
          updatedMarks = Decoration.none
        }
      }

      return updatedMarks
    },

    provide: f => EditorView.decorations.from(f),
  })

  // ========== 5. 工具函数：为当前选区添加对应装饰 ==========
  function markSelection (view: EditorView, markType: 'remove' | 'delete' | 'add') {
    const ranges = view.state.selection.ranges.filter(r => !r.empty)
    if (ranges.length === 0) return false

    const effects: StateEffect<unknown>[] = []

    for (const range of ranges) {
      switch (markType) {
        case 'remove': {
          effects.push(addRemoveMark.of({ from: range.from, to: range.to }))

          break
        }
        case 'delete': {
          effects.push(addDeleteMark.of({ from: range.from, to: range.to }))

          break
        }
        case 'add': {
          effects.push(addAddMark.of({ from: range.from, to: range.to }))

          break
        }
      // No default
      }
    }

    // 第一次使用时动态添加 field 和 theme
    if (!view.state.field(marksField, false)) {
      effects.push(
        StateEffect.appendConfig.of([marksField, multiDecorationTheme]),
      )
    }

    view.dispatch({ effects })
    return true
  }

  // ========== 6. 清除所有装饰 ==========
  function clearAllMarksInEditor (view: EditorView) {
    if (!view.state.field(marksField, false)) return false

    view.dispatch({
      effects: clearAllMarks.of(null),
    })
    return true
  }

  // ========== 7. 快捷键绑定 ==========
  const markKeymap = [
    {
      key: 'Mod-1',
      preventDefault: true,
      run: (view: EditorView) => markSelection(view, 'remove'),
    },
    {
      key: 'Mod-2',
      preventDefault: true,
      run: (view: EditorView) => markSelection(view, 'delete'),
    },
    {
      key: 'Mod-3',
      preventDefault: true,
      run: (view: EditorView) => markSelection(view, 'add'),
    },
    {
      key: 'Mod-Shift-h',
      preventDefault: true,
      run: clearAllMarksInEditor,
    },
  ]

  // ========== 8. 编辑器初始化 ==========
  const coder = ref<HTMLElement | null>(null)
  let view: EditorView

  const extensions = [
    lineNumbers(),
    foldGutter(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle),
    bracketMatching(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSelectionMatches(),
    keymap.of([
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...markKeymap, // 使用新的快捷键
    ]),
  ]

  onMounted(() => {
    const state = EditorState.create({
      doc: 'Start document',
      extensions,
    })

    view = new EditorView({
      state,
      parent: coder.value as HTMLElement,
    })
  })
</script>

<template>
  <div ref="coder" class="code-editor" />
</template>

<style scoped lang="scss">
.code-editor {
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Fira Code', monospace;
  height: 100vh;
  overflow: hidden;
}
</style>
