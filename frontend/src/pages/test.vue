<script setup lang="ts">
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
  <content>
    <div ref="coder" />
  </content>

</template>

<style scoped lang="scss">
</style>
