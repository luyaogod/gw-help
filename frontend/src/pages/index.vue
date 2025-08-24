<script setup lang="ts">
</script>

<template>
  <PageTem>
    <template #tool-prepend>
      <v-btn>清除</v-btn>
      <v-btn>复制</v-btn>
      <v-btn icon="mdi-sort" />
    </template>
    <template #tool-append>
      <v-btn>清除</v-btn>
      <v-btn>复制</v-btn>
    </template>
    <template #page-content>
      <!-- <v-container class="bg-green pa-0 mt-1" fluid height="100%"> -->
      <v-row dense>
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            class="mx-auto"
            subtitle="JSON5转换JSON"
            title="JSON5"
            to="/json5"
            variant="tonal"
          />

        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-card
            class="mx-auto"
            subtitle="排序整理QQ邮箱导出的发票文件"
            title="发票整理"
            variant="tonal"
          />

        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-card
            class="mx-auto"
            href="/visio2"
            subtitle="VISIO转换文件批量转换为PDF文件"
            title="VISIO转换"
            variant="tonal"
          />

        </v-col>
      </v-row>
    </template>
  </PageTem>

</template>
