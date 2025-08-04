<script lang="ts" setup>
  import { computed } from 'vue'
  import { useDisplay } from 'vuetify'
  import { useApp } from '@/stores/app'

  const app = useApp()

  const { name } = useDisplay()
  const drwawerWidth = computed(() => {
    switch (name.value) {
      case 'xs': { return 120
      }
      case 'sm': { return 150
      }
      case 'md': { return 200
      }
      case 'lg': { return 200
      }
      case 'xl': { return 200
      }
      default: { return 200
      }
    }
  })
</script>

<template>
  <v-app class="bg-grey-lighten-3 pa-2">
    <v-navigation-drawer
      v-model="app.isSiderOpen"
      class="bg-grey-lighten-3"
      floating
      permanent
      :width="drwawerWidth"
    >
      <!-- 目录 -->
      <Menu />
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
</style>
