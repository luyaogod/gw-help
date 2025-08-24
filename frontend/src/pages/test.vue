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

  // 定义二维表中每一行的类型：每一行是一个字符串数组
  type TableRow = string[]

  // 定义函数参数类型
  type ConvertTableOptions = {
    keyColumn?: number
    valueColumn?: number
    commentColumns?: number[]
  }

  function convertTableToJsonWithComments (
    table: TableRow[],
    options: ConvertTableOptions = {},
  ): string {
    const {
      keyColumn = 0,
      valueColumn = 1,
      commentColumns = [2, 3],
    } = options

    // 手动构建带注释的JSON字符串
    let jsonString = '{\n'

    for (const [index, row] of table.entries()) {
      // 获取键值
      const key = row[keyColumn]
      const value = row[valueColumn]

      // 合并指定列的注释
      const comments = commentColumns.map(colIndex => row[colIndex] || '').join('')

      // 添加属性和注释
      jsonString += `  "${key}": "${value}" /*${comments}*/`

      // 如果不是最后一项，添加逗号
      if (index < table.length - 1) {
        jsonString += ','
      }

      jsonString += '\n'
    }

    jsonString += '}'

    return jsonString
  }

  // 使用示例
  const table: TableRow[] = [
    ['field35', 'string', 'TRUE', 'ERP销售订单号'],
    ['field37', 'string', 'TRUE', 'ERP工单号'],
    ['type', 'string', 'TRUE', '客户名称'],
    ['field1', 'string', 'TRUE', '客户代码'],
    ['name', 'string', 'TRUE', '客供料名称'],
    ['field8', 'string', 'TRUE', '产品名称'],
    ['field9', 'string', 'TRUE', '成品名称'],
    ['field27', 'string', 'TRUE', 'Device Group'],
    ['field5', 'string', 'TRUE', '封装形式'],
    ['field39', 'string', 'FALSE', 'COO'],
    ['field16', 'string', 'TRUE', '销售组织代码'],
    ['field18', 'string', 'FALSE', 'PDID'],
    ['field2', 'string', 'TRUE', '制令单号'],
    ['field13', 'string', 'TRUE', '制令单别'],
    ['field12', 'string', 'TRUE', '订单类型'],
    ['field10', 'string', 'TRUE', '订单类别'],
    ['field7', 'string', 'TRUE', '制表日期'],
    ['date', 'string', 'TRUE', '期望交期'],
    ['field6', 'string', 'TRUE', '订单数量'],
    ['field24', 'string', 'FALSE', 'Return回货'],
    ['field34', 'string', 'FALSE', 'WO Process'],
  ]

  // 调用函数
  const jsonResult = convertTableToJsonWithComments(table, {
    keyColumn: 0,
    valueColumn: 1,
    commentColumns: [2, 3],
  })
  console.log(jsonResult)

</script>

<template>
  <content>
    <div ref="coder" />
  </content>

</template>

<style scoped lang="scss">
</style>
