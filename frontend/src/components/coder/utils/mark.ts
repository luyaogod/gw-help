import { StateEffect, StateField } from '@codemirror/state'
import {
  Decoration, EditorView,
} from '@codemirror/view'

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

export const markField = StateField.define({
  create: () => Decoration.none,
  update: (marks, tr) => {
    // eslint-disable-next-line unicorn/no-array-callback-reference
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

export function mark (view: EditorView, from: number, to: number, className: string) {
  if (!view) {
    return
  }
  const effects: StateEffect<unknown>[] = []

  effects.push(markEffect.of({ from, to, className }))
  view.dispatch({
    effects,
  })
}

export function clearAllMarks (view: EditorView) {
  if (!view) {
    return
  }

  view.dispatch({
    effects: clearMarksEffect.of(null),
  })
}
