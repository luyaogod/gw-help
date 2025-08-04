<script setup lang="ts">
  import { ref } from 'vue'

  const params = ref({
    name: '',
  })

  const scriptRet = ref('')

  function play () {
    // @ts-ignore
    window.pywebview.api.greet(params.value.name).then(res => {
      console.log(res)
      scriptRet.value = res
    })
  }

</script>

<template>
  <PageTem>
    <template #tool-prepend>
      <!-- 运行按钮 -->
      <v-btn icon="mdi-play" @click="play()" />
    </template>
    <template #tool-append>
      <!-- 复制结果 -->
    </template>
    <template #page-content>
      <v-text-field v-model="params.name" label="VISIO目录路径" />
      <v-textarea
        v-model="scriptRet"
        auto-grow
        disabled
        hide-details
        variant="outlined"
      />

    </template>
  </PageTem>

</template>
