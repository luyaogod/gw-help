<script setup lang="ts">
  import { HotTable } from '@handsontable/vue3'
  import {
    registerLanguageDictionary,
    zhCN,
  } from 'handsontable/i18n'
  import { registerAllModules } from 'handsontable/registry'
  import { ref } from 'vue'
  import 'handsontable/styles/handsontable.css'
  import 'handsontable/styles/ht-theme-main.css'

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
      ['field1', '新值'],
      ['新', 10],
      ['年', 20],
      ['好', 30],
      [666],
    ],
    height: 'auto',
    rowHeaders: true,

    autoWrapRow: true,
    autoWrapCol: true,
    licenseKey: 'non-commercial-and-evaluation',
    language: 'zh-CN',
  })

  const sql = ref('')
  const tableName = ref('Table')
  const hotTableRef = ref<InstanceType<typeof HotTable> | null>(null)
  function addNewRow () {
    if (hotTableRef.value?.hotInstance) {
      const hot = hotTableRef.value.hotInstance
      // 在表格最后插入一行空数据
      hot.alter('insert_col_start')
    }
  }

  interface GenerateSQLParams {
    tName?: string
    tData: any[][]
  }

  function generateSQL ({ tName = 'Table', tData }: GenerateSQLParams): string {
    // 如果没有数据或数据行不足，返回空字符串
    if (!tData || tData.length < 2) return ''

    const sqlStatements: string[] = []
    const fieldNames = tData[0]

    // 从第二行开始处理数据
    for (let i = 1; i < tData.length; i++) {
      const row = tData[i]
      // 跳过空行或长度不足的行（至少需要1个条件字段和1个值字段）
      if (!row || row.length < 2) continue

      // 获取要设置的值（最后一列）
      const value = row.at(-1)
      // 条件字段和值（除最后一列外的所有列）
      const conditions: string[] = []

      // 构建条件部分
      for (let j = 0; j < Math.min(row.length - 1, fieldNames.length); j++) {
        const fieldName = fieldNames[j]
        const fieldValue = row[j]

        // 处理不同数据类型的格式
        if (typeof fieldValue === 'string') {
          conditions.push(`${fieldName} = '${fieldValue}'`)
        } else if (fieldValue === null || fieldValue === undefined) {
          conditions.push(`${fieldName} IS NULL`)
        } else {
          conditions.push(`${fieldName} = ${fieldValue}`)
        }
      }

      // 构建完整的SQL语句
      const valuePart = typeof value === 'string' ? `'${value}'` : value
      const sql = `UPDATE ${tName} SET value = ${valuePart} WHERE ${conditions.join(' AND ')};`
      sqlStatements.push(sql)
    }

    // 返回用换行符分隔的SQL语句
    return sqlStatements.join('\n')
  }

  function run () {
    sql.value = generateSQL({ tName: tableName.value, tData: hotSettings.value.data })
  }

//   const exampleData = [
//     ['field1', 'field2', 'newValue'],
//     [1, '新', 10],
//     [2, '年', 20],
//     [3, '好', 30],
//     [4],
//   ]
//   console.log(generateSQL({ tData: exampleData }))
// UPDATE Table SET value = 10 WHERE field1 = 1 AND field2 = '新';
// UPDATE Table SET value = 20 WHERE field1 = 2 AND field2 = '年';
// UPDATE Table SET value = 30 WHERE field1 = 3 AND field2 = '好';
</script>

<template>
  <PageTem>
    <template #tool-prepend>
      <!-- btns -->
      <v-btn icon="mdi-play" @click="run()" />
      <v-btn @click="addNewRow()">+字段</v-btn>
    </template>
    <template #tool-append>
      <!-- btns -->
    </template>
    <template #page-content>
      <v-container class="pa-0 mt-1" fluid height="100%">
        <v-row class="h-100  ma-0">
          <!-- 左侧 -->
          <v-col cols="6 pa-0 pr-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-text-field v-model="tableName" label="表名" />
            <hot-table
              ref="hotTableRef"
              :settings="hotSettings"
            />
          </v-col>

          <!-- 右侧 -->
          <v-col cols="6 pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden">
            <v-sheet>
              <CodeMirror ref="rightCoder" v-model="sql" language="sql" />
            </v-sheet>

          </v-col>
        </v-row>
      </v-container>

    </template>
  </PageTem>
</template>

<style scoped lang="scss">
</style>
