import type { Extension } from '@codemirror/state'
import type {
  ViewUpdate } from '@codemirror/view'
import type { ComputedRef } from 'vue'
import { defaultKeymap,
  history, historyKeymap } from '@codemirror/commands'
import {
  bracketMatching, defaultHighlightStyle, foldGutter,
  foldKeymap, indentOnInput, syntaxHighlighting,
} from '@codemirror/language'
import {
  highlightSelectionMatches, searchKeymap,
} from '@codemirror/search'
import { Compartment, EditorState } from '@codemirror/state'
import { crosshairCursor,
  drawSelection, dropCursor,
  EditorView,
  highlightActiveLine, highlightActiveLineGutter,
  highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view'
import { computed } from 'vue'

export interface UseExtensionsOptions {
  language?: any
  tabSize?: number
  extensions?: Extension[]
}

export interface UseExtensionsReturn {
  extensions: ComputedRef<Extension[]>
}

export function useExtensions (options: UseExtensionsOptions = {}): UseExtensionsReturn {
  // 动态配置
  // @see https://codemirror.net/examples/config/
  const language = new Compartment()
  const tabSize = new Compartment()

  const extensions = computed(() =>
    [
      // EditorView更新事件监听
      EditorView.updateListener.of((updage: ViewUpdate): void => {
        if (updage.changes.empty || !updage.docChanged) {
          return
        }
      }),
      // 行号侧边栏
      lineNumbers(),
      // 带有代码折叠标记的侧边栏
      foldGutter(),
      // 用占位符替换不可打印字符
      highlightSpecialChars(),
      // 撤销历史记录
      history(),
      // 用自定义实现替换原生的光标/选择功能
      drawSelection(),
      // 在编辑器上拖动时显示拖拽光标
      dropCursor(),
      // 允许多个光标/选择区域
      EditorState.allowMultipleSelections.of(true),
      // 输入特定内容时自动重新缩进
      indentOnInput(),
      // 使用默认样式进行语法高亮
      syntaxHighlighting(defaultHighlightStyle),
      // 高亮显示光标附近的匹配括号
      bracketMatching(),
      // 允许按住alt键拖动选择矩形区域
      rectangularSelection(),
      // 按住alt键时将光标变为十字准星
      crosshairCursor(),
      // 特殊样式显示当前行
      highlightActiveLine(),
      // 特殊样式显示当前行的侧边栏
      highlightActiveLineGutter(),
      // 高亮显示与选中文本匹配的内容
      highlightSelectionMatches(),
      // 语言
      options.language ? language.of(options.language) : undefined,
      // tabSize
      options.tabSize
        ? tabSize.of(EditorState.tabSize.of(options.tabSize))
        : undefined,
      keymap.of([
      // 一组基础快捷键绑定
        ...defaultKeymap,
        // 搜索相关快捷键
        ...searchKeymap,
        // 重做/撤销快捷键
        ...historyKeymap,
        // 代码折叠快捷键
        ...foldKeymap,
      ],
      ),
      ...(options.extensions ?? []),
    ].filter((extension): extension is Extension => !!extension))

  return {
    extensions,
  }
}
