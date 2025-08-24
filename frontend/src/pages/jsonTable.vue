<script setup lang="ts">
  import { json } from '@codemirror/lang-json'
  import { HotTable } from '@handsontable/vue3'
  import { useClipboard } from '@vueuse/core'
  import {
    registerLanguageDictionary,
    zhCN,
  } from 'handsontable/i18n'
  import { registerAllModules } from 'handsontable/registry'
  import { computed, ref } from 'vue'
  import { useMsg } from '@/uses/useMsg'
  import 'handsontable/styles/handsontable.css'
  import 'handsontable/styles/ht-theme-main.css'

  const { msg, setMsg, isShow, showMsg } = useMsg()
  const { copy } = useClipboard()
  registerLanguageDictionary(zhCN)
  registerAllModules()

  const hotSettings = ref({
    contextMenu: [
      'remove_col',
      'remove_row',
      'row_above',
      'row_below',
    ],
    themeName: 'ht-theme-main',
    data: [
      ['field1', 'string', 'TRUE', '工单单号'],
      ['field2', 'string', 'TRUE', '工单时间'],
      ['field3', 'string', 'TRUE', '客户名称'],
      ['field4', 'string', 'TRUE', '客户代码'],
      ['field5', 'string', 'TRUE', '产品名称'],
    ],
    height: 'auto',
    rowHeaders: true,
    colHeaders: true,
    autoWrapRow: true,
    autoWrapCol: true,
    licenseKey: 'non-commercial-and-evaluation',
    language: 'zh-CN',
  })

  const jsonRet = ref('')
  const tableRef = ref<InstanceType<typeof HotTable> | null>(null)
  const keyCol = ref('A')
  const valueCol = ref('B')

  // 将Excel列标识（如A、B、...、Z、AA、AB...）转换为数字索引
  const excelColumnToNumber = (column: string): number => {
    let result = 0
    for (let i = 0; i < column.length; i++) {
      const charCode = column.codePointAt(i)
      if (charCode === undefined) {
        throw new Error('无效的列标识')
      }
      result = result * 26 + (charCode - 'A'.codePointAt(0)! + 1)
    }
    return result - 1 // 转换为0基索引
  }

  // 校验是否为有效的Excel列标识（纯字母）
  const isValidExcelColumn = (value: string): boolean => {
    return /^[A-Z]+$/i.test(value)
  }

  // 校验规则
  const keyColRules = [
    (value: string) => !!value || '键列不能为空',
    (value: string) => isValidExcelColumn(value) || '键列必须是纯字母（如A、B、AA等）',
  ]

  const valueColRules = [
    (value: string) => !!value || '值列不能为空',
    (value: string) => isValidExcelColumn(value) || '值列必须是纯字母（如A、B、AA等）',
  ]

  // 计算属性：将列标识转换为数字索引
  const KeyColNum = computed(() => {
    if (!keyCol.value || !isValidExcelColumn(keyCol.value)) return 0
    return excelColumnToNumber(keyCol.value.toUpperCase())
  })

  const ValueColNum = computed(() => {
    if (!valueCol.value || !isValidExcelColumn(valueCol.value)) return 1
    return excelColumnToNumber(valueCol.value.toUpperCase())
  })

  function convertTableToJson (
    table: (string | number)[][],
    keyColumn = 0,
    valueColumn = 1,
  ): string {
    // 手动构建带注释的JSON字符串
    let jsonString = '{\n'

    for (const [index, row] of table.entries()) {
      // 获取键值
      const key = row[keyColumn]
      const value = row[valueColumn]

      // 将除了key和value列之外的所有列内容作为注释拼接
      const comments = row
        .filter((_, colIndex) => colIndex !== keyColumn && colIndex !== valueColumn)
        .join('')

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

  function run () {
    jsonRet.value = convertTableToJson(hotSettings.value.data, KeyColNum.value, ValueColNum.value)
  }

  function clear () {
    keyCol.value = 'A'
    valueCol.value = 'B'
    jsonRet.value = ''
    const iniData = [
      ['', '', ''],
      ['', '', ''],
    ]
    tableRef.value?.hotInstance.loadData(iniData)
    hotSettings.value.data = iniData
  }

</script>

<template>
  <v-snackbar v-model="isShow" :text="msg" timeout="1000" />
  <PageTem>
    <template #tool-prepend>
      <v-btn icon="mdi-play" @click="run()" />
      <v-btn @click="clear()">清除</v-btn>
    </template>
    <template #tool-append>
      <v-btn @click="()=>{copy(jsonRet); setMsg('复制成功'); showMsg()}">复制</v-btn>
    </template>
    <template #page-content>
      <ContentSplit>
        <template #left>
          <v-row class="mb-1">
            <v-col cols="4">
              <v-text-field
                v-model="keyCol"
                label="键列"
                :rules="keyColRules"
                @blur="keyCol = keyCol?.toUpperCase()"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="valueCol"
                label="值列"
                :rules="valueColRules"
                @blur="valueCol = valueCol?.toUpperCase()"
              />
            </v-col>
          </v-row>
          <hot-table
            ref="tableRef"
            :settings="hotSettings"
          />
        </template>
        <template #right>
          <Coder ref="rightCoder" v-model="jsonRet" :language="json()" />
        </template>
      </ContentSplit>

    </template>
  </PageTem>
</template>

<style scoped lang="scss">
</style>
