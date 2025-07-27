import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApp = defineStore('app', () => {
  // 使用 ref 创建响应式布尔值
  const isSiderOpen = ref(true)

  return {
    isSiderOpen,
  }
})
