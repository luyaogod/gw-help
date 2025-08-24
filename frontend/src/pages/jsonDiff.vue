<script setup lang="ts">
  import type { JSONPath, Node } from 'jsonc-parser'
  import type { Op } from 'jsondiffpatch/formatters/jsonpatch'
  import type { CoderExposes } from '@/components/coder/index.vue'
  import { json } from '@codemirror/lang-json'
  import { EditorView } from '@codemirror/view'
  import { useClipboard } from '@vueuse/core'
  import { findNodeAtLocation, parse, parseTree } from 'jsonc-parser'
  import * as jsondiffpatch from 'jsondiffpatch'
  import * as jsonPatchFormater from 'jsondiffpatch/formatters/jsonpatch'
  import { ref } from 'vue'
  import { clearAllMarks, mark, markField } from '@/components/coder/utils/mark'
  import { useMsg } from '@/uses/useMsg'
  import { sortObject } from '@/utils/sortObj'

  const { msg, setMsg, isShow, showMsg } = useMsg()
  const { copy } = useClipboard()

  const EditorL = ref<CoderExposes>(null as any)
  const EditorR = ref<CoderExposes>(null as any)
  const docL = ref('1111')
  const docR = ref('1111')

  interface DiffNode {
    op: string
    path: JSONPath
  }

  interface DiffNodeLoc extends DiffNode {
    offset: number
    length: number
  }

  /**
   * 将jsondiffpatch输出的JSONPATCH格式转换为数组格式
   *
   * 如：/studnet/name/1 => [ "studnet", "name",1 ]
   */
  function jsonPatchPathToArray (path: string, data: any) {
    if (!path.startsWith('/')) {
      throw new Error('JSON Patch path must start with "/"')
    }

    const parts = path.slice(1).split('/')
    let current = data
    const result = []

    for (const part of parts) {
      if (current === undefined || current === null) {
        break // 如果数据不存在，提前终止
      }

      // 尝试解析为数字（可能是数组索引）
      const possibleNumber = Number(part)
      const isArrayIndex = (
        Array.isArray(current)
        && Number.isInteger(possibleNumber)
        && possibleNumber >= 0
      )

      if (isArrayIndex) {
        // 如果是数组，且 part 是有效索引，则存储为数字
        result.push(possibleNumber)
        current = current[possibleNumber]
      } else {
        // 否则视为对象的键（字符串）
        result.push(part)
        current = current[part]
      }
    }

    return result
  }

  /** 操作类型过滤和封装 */
  function laodDiffNodes (scope: string[], ops: Op[], json: any): DiffNode[] {
    return ops
      .filter(op => scope.includes(op.op)) // 筛选出需要的操作类型
      .map(op => ({ // 转换为所需的 Opt 格式
        op: op.op,
        path: jsonPatchPathToArray(op.path, json),
      }))
  }

  /** 查找异动节点再原始字符串的偏移位置 */
  function laodDiffNodeLocs (node: Node, diffNodes: DiffNode[]): DiffNodeLoc[] {
    const diffNodeLocs: DiffNodeLoc[] = []
    for (const diffNode of diffNodes) {
      const item = findNodeAtLocation(node, diffNode.path)
      if (item) {
        diffNodeLocs.push({
          op: diffNode.op,
          path: diffNode.path,
          offset: item.offset,
          length: item.length,
        })
      } else {
        throw new Error(`Can't find node at ${diffNode.path}`)
      }
    }
    return diffNodeLocs
  }

  /** 获取 diff 节点的位置 */
  function loadMarkList (left: string, right: string): DiffNodeLoc[] {
    const jsonL = parse(left)
    const jsonR = parse(right)
    const astL = parseTree(left)
    const delta = jsondiffpatch.diff(jsonL, jsonR)
    const ops = jsonPatchFormater.format(delta)
    const diffNodes = laodDiffNodes(['remove', 'replace', 'move'], ops, jsonL)
    return laodDiffNodeLocs(astL as Node, diffNodes)
  }

  function markDiff () {
    clearAllMarks(EditorL.value.view)
    clearAllMarks(EditorR.value.view)
    const mlistL = loadMarkList(docL.value, docR.value)
    const mlistR = loadMarkList(docR.value, docL.value)
    for (const m of mlistL) {
      if (m.op === 'replace') {
        // 对发生替换的位置高亮显示
        mark(EditorL.value.view, m.offset, (m.offset + m.length), 'cm-diff-replace')
      }
      if (m.op === 'remove') {
        // 对发生删除的位置高亮显示
        mark(EditorL.value.view, m.offset, (m.offset + m.length), 'cm-diff-remove')
      }
    }
    for (const m of mlistR) {
      if (m.op === 'replace') {
        // 对发生替换的位置高亮显示
        mark(EditorR.value.view, m.offset, (m.offset + m.length), 'cm-diff-replace')
      }
      if (m.op === 'remove') {
        // 对发生删除的位置高亮显示
        mark(EditorR.value.view, m.offset, (m.offset + m.length), 'cm-diff-add')
      }
    }
  }

  watch(docL, () => {
    markDiff()
  })

  watch(docR, () => {
    markDiff()
  })

  function sorL () {
    const sorted = sortObject(parse(docL.value), true)
    docL.value = JSON.stringify(sorted, null, 2)
  }

  function sorR () {
    const sorted = sortObject(parse(docR.value), true)
    docR.value = JSON.stringify(sorted, null, 2)
  }

  onMounted(() => {
    const markCssExtension = EditorView.baseTheme(
      {
        '.cm-marked-remove': {
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
        },
        '.cm-diff-add': {
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
        },
        '.cm-diff-remove': {
          backgroundColor: 'rgba(255, 215, 0, 0.3)',
        },
      })

    EditorL.value.addExtensions(
      [markCssExtension],
    )
    EditorR.value.addExtensions(
      [markCssExtension],
    )
    // mark(EditorL.value.view, 0, 3, 'cm-diff-remove')
  })
</script>

<template>
  <v-snackbar v-model="isShow" :text="msg" timeout="1000" />

  <PageTem>
    <template #tool-prepend>
      <v-btn>清除</v-btn>
      <v-btn @click="()=>{copy(docL); setMsg('复制成功'); showMsg()}">复制</v-btn>
      <v-btn @click="()=>{sorL();sorR()}">升序</v-btn>
    </template>
    <template #tool-append>
      <v-btn>清除</v-btn>
      <v-btn @click="()=>{copy(docR); setMsg('复制成功'); showMsg()}">复制</v-btn>
    </template>
    <template #page-content>
      <v-container class="pa-0 mt-1" fluid height="100%">
        <v-row class="h-100  ma-0">
          <!-- 左侧 -->
          <v-col cols="6 pa-0 pr-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-sheet>
              <Coder ref="EditorL" v-model="docL" :extensions="[markField]" :language="json()" />
            </v-sheet>
          </v-col>

          <!-- 右侧 -->
          <v-col cols="6 pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-sheet>
              <Coder ref="EditorR" v-model="docR" :extensions="[markField]" :language="json()" />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>

    </template>
  </PageTem>

</template>

<style scoped>
</style>
