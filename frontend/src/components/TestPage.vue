<script setup lang="ts">

  import { computed, ref } from 'vue'

  const docJson5 = ref('console.log("hello world!")')

  const docJson = computed(() =>
    docJson5.value,
  )

</script>

<template>
  <v-container class="pa-0 mt-1" fluid height="100%">
    <v-row class="h-100  ma-0">
      <!-- 左侧 -->
      <v-col cols="6 pa-0 pr-1 h-100 overflow-y-auto overflow-x-hidden">
        <v-sheet>
          <CodeMirror v-model="docJson5" language="js" />
        </v-sheet>
      </v-col>

      <!-- 右侧 -->
      <v-col cols="6 pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden">
        <v-sheet>
          <CodeMirror v-model="docJson" language="js" />
        </v-sheet>

      </v-col>
    </v-row>
  </v-container>

</template>
