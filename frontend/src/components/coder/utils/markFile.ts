import type { DecorationSet } from '@codemirror/view'
import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'

/**
 * 标记装饰器创建函数
 */
const createMarkDecoration = (className: string) => Decoration.mark({ class: className })

/** effect生成器:创建mark */
const addMark = StateEffect.define<{ from: number, to: number, className: string }>({
  // 要求我们声明一个map方法，用于将原始的 from 和 to 位置映射到更新后的位置
  map: ({ from, to, className }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
    className,
  }),
})

/** effect生成器:清空mark */
const clearMark = StateEffect.define()

/**
 * 标记管理器，管理一组标记
 */
const markField = StateField.define<DecorationSet>({
  /**
   * create 方法用于初始化
   *
   * @returns 创建一个空的装饰集合，表示初始状态下没有任何装饰（下划线）
   */
  create () {
    return Decoration.none
  },

  /**
   * update 方法用于更新，当doc发生变化时它将调用
   */
  update (underlines, tr) {
    // 将管理的装饰集合根据文档变更重新进行位置映射
    // eslint-disable-next-line unicorn/no-array-callback-reference
    let updateMarks = underlines.map(tr.changes)

    // 遍历所有事务的effects字段
    for (const effect of tr.effects) {
      // 检查是否为mark类型的effect
      if (effect.is(addMark)) {
        // 如果是则创建对应的装饰器
        const markD = createMarkDecoration(effect.value.className)
        updateMarks = updateMarks.update({
          add: [markD.range(effect.value.from, effect.value.to)],
        })
      }
      if (effect.is(clearMark)) {
        updateMarks = Decoration.none
      }
    }

    return updateMarks
  },
  // 提供provide方法用于展示
  provide: f => EditorView.decorations.from(f),
})

/**
 * 为指定范围添加标记
 *
 * 使用前请自行定义好className对应的css样式
 *
 * 通过全局css样式，或者EditorView.baseTheme创建样式拓展再更新到编辑器中
 */
export function mark (view: EditorView, from: number, to: number, className: string) {
  const effects: StateEffect<unknown>[] = []
  const markEffect = addMark.of({
    from,
    to,
    className,
  })
  effects.push(markEffect)
  // 5. 检查view中是否创建了下划线装饰器集合管理器
  if (!view.state.field(markField, false)) {
    // 如果没创建则创建管理器，提交事务创建管理器
    effects.push(StateEffect.appendConfig.of([markField]))
  }
  view.dispatch({ effects })
}

/**
 * 清除所有的标记
 */
export function clearMarks (view: EditorView) {
  view.dispatch({
    effects: [
      clearMark.of(null),
    ],
  })
}
