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
      <v-btn icon="mdi-play" @click="play()" />
    </template>
    <template #tool-append>
      <v-btn icon="mdi-content-copy" size="small" />
    </template>
    <template #page-content>
      <!-- <v-container class="bg-green pa-0 mt-1" fluid height="100%"> -->
      <v-container class="pa-0 mt-1" fluid height="100%">
        <!-- <v-row class="bg-yellow h-100  ma-0"> -->
        <v-row class="h-100  ma-0">
          <v-col cols="6 pa-0 pr-1 h-100 overflow-y-auto overflow-x-hidden">
            <!-- <v-sheet color="red"> -->
            <v-sheet>
              <v-text-field v-model="params.name" label="姓名" />
            </v-sheet>
          </v-col>

          <v-col cols="6 pa-0 pl-1 h-100 overflow-y-auto overflow-x-hidden">
            <!-- <v-sheet color="blue"> -->
            <v-sheet>
              <v-textarea
                v-model="scriptRet"
                auto-grow
                hide-details
                variant="outlined"
              />
            </v-sheet>

          </v-col>
        </v-row>
      </v-container>
    </template>
  </PageTem>

</template>
