<script setup lang="ts">
  import type { JSONPath, Node } from 'jsonc-parser'
  import type { Op } from 'jsondiffpatch/formatters/jsonpatch'
  import { findNodeAtLocation, parseTree } from 'jsonc-parser'
  import * as jsondiffpatch from 'jsondiffpatch'
  import * as jsonPatchFormater from 'jsondiffpatch/formatters/jsonpatch'
  import { ref } from 'vue'
  const leftCoder = ref(null) as any
  const rightCoder = ref(null) as any

  interface Opt {
    op: string
    path: JSONPath
  }

  interface SourceOpt extends Opt {
    offset: number
    length: number
  }

  /**
   * jsondiffpatch输出的结果为JSONPATCH格式转换为数组格式
   * 如：/studnet/name/1 转换成 [ "studnet", "name",1 ]
   **/
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

  /**
   * 封装需要的异动操作类型
  **/
  function loadOpts (scope: string[], ops: Op[], json: any): Opt[] {
    const opts: Opt[] = []
    for (const op of ops) {
      // 只收集需要的操作类型
      if (scope.includes(op.op)) {
        opts.push({
          op: op.op,
          path: jsonPatchPathToArray(op.path, json),
        })
      }
    }
    return opts
  }

  /**
   * 查找和封装异动操作涉及的原始JSON字符串位置
  **/
  function loadSourceOpt (node: Node, opts: Opt[]): SourceOpt[] {
    const sourceOpts: SourceOpt[] = []
    for (const opt of opts) {
      const item = findNodeAtLocation(node, opt.path)
      if (item) {
        sourceOpts.push({
          op: opt.op,
          path: opt.path,
          offset: item.offset,
          length: item.length,
        })
      } else {
        throw new Error(`Can't find node at ${opt.path}`)
      }
    }
    return sourceOpts
  }

  function loadMarkList (left: string, right: string): SourceOpt[] {
    const scope = ['remove', 'replace', 'move']
    const jsonL = JSON.parse(left)
    const jsonR = JSON.parse(right)
    const astL = parseTree(left)
    const delta = jsondiffpatch.diff(jsonL, jsonR)
    const ops = jsonPatchFormater.format(delta)
    const opts = loadOpts(scope, ops, jsonL)
    return loadSourceOpt(astL as Node, opts)
  }

  const docL = ref('')
  const docR = ref('')

  function reMark () {
    leftCoder.value.clearAllMarks()
    rightCoder.value.clearAllMarks()
    const mlistL = loadMarkList(docL.value, docR.value)
    for (const m of mlistL) {
      if (m.op === 'replace') {
        leftCoder.value.markText(m.offset, (m.offset + m.length), 'cm-marked-replace')
      }
      if (m.op === 'remove') {
        leftCoder.value.markText(m.offset, (m.offset + m.length), 'cm-marked-remove')
      }
    }
    const mlistR = loadMarkList(docR.value, docL.value)
    for (const m of mlistR) {
      if (m.op === 'replace') {
        rightCoder.value.markText(m.offset, (m.offset + m.length), 'cm-marked-replace')
      }
      if (m.op === 'remove') {
        rightCoder.value.markText(m.offset, (m.offset + m.length), 'cm-marked-add')
      }
    }
  }

  watch(docL, () => {
    reMark()
  })

  watch(docR, () => {
    reMark()
  })

</script>

<template>
  <PageTem>
    <template #tool-prepend>
      <!-- 运行按钮 -->
      <!-- <v-btn icon="mdi-play" @click="play()" /> -->
    </template>
    <template #tool-append>
      <!-- 复制结果 -->
      <!-- <v-btn icon="mdi-content-copy" size="small" /> -->
    </template>
    <template #page-content>
      <v-container class="pa-0 mt-1" fluid height="100%">
        <v-row class="h-100  ma-0">
          <!-- 左侧 -->
          <v-col cols="6 pa-0 pr-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-sheet>
              <CodeMirrorMark ref="leftCoder" v-model="docL" language="js" />
            </v-sheet>
          </v-col>

          <!-- 右侧 -->
          <v-col cols="6 pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-sheet>
              <CodeMirrorMark ref="rightCoder" v-model="docR" language="js" />
            </v-sheet>

          </v-col>
        </v-row>
      </v-container>

    </template>
  </PageTem>

</template>

<style scoped>

</style>
