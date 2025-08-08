<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  const path = ref('')

  const scriptRet = ref('')

  const loading = ref(false)

  function play () {
    loading.value = true

    // @ts-ignore
    window.pywebview.api.pyapi_visio2(path.value, 'jspai_visio2_set_ret').then(res => {
      scriptRet.value = res
      loading.value = false
    })
  }

  function setRet (data: string) {
    scriptRet.value = data
  }

  onMounted(() => {
    // @ts-ignore
    window.jspai_visio2_set_ret = setRet
  })

</script>

<template>
  <PageTem>
    <template #tool-prepend>
      <!-- 运行按钮 -->
      <v-btn icon="mdi-play" :loading="loading" @click="play()" />
    </template>
    <template #tool-append>
      <!-- 复制结果 -->
    </template>
    <template #page-content>
      <v-text-field v-model="path" label="VISIO目录路径" :loading="loading" />
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
