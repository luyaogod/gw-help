<script setup lang="ts">
  import { ref } from 'vue'

  const params = ref({
    name: '',
  })

  const loading = ref(false)

  const scriptRet = ref('')

  function play () {
    loading.value = true

    // @ts-ignore
    window.pywebview.api.pyapi_qq_invoice(params.value.name).then(res => {
      scriptRet.value = res
      loading.value = false
    })
  }

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
      <v-text-field v-model="params.name" label="发票目录路径" :loading="loading" />
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
