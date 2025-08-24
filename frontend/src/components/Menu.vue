<script setup lang="ts">
</script>

<template>
  <v-list density="compact" nav>
    <v-list-subheader>JSON</v-list-subheader>
    <v-list-item title="JSON5" to="/json5" value="json5" />
    <v-list-item title="JSON差异" to="/json-diff" value="json-diff" />
    <v-list-subheader>SQL</v-list-subheader>
    <v-list-item title="列表转SQL" to="/sql-list" value="sql-list" />
    <v-list-item title="更新一列" to="/sql-update-col" value="sql-update-col" />
    <v-list-subheader>日常</v-list-subheader>
    <v-list-item title="VISIO转PDF" to="/visio2" value="visio2" />
    <v-list-item title="QQ发票整理" to="/qq-invoice" value="qqInvoice" />
    <v-list-item title="测试" to="/test" value="test" />
  </v-list>
</template>

<style scoped lang="scss">
</style>
