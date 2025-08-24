import type { Ref } from 'vue'

export interface useMsgReturn {
  msg: Ref<string>
  isShow: Ref<boolean>
  showMsg: () => void
  setMsg: (value: string) => void
}

export function useMsg (): useMsgReturn {
  const msg = ref('')
  const isShow = ref(false)
  function setMsg (value: string) {
    msg.value = value
  }

  function showMsg () {
    isShow.value = true
  }
  return {
    msg,
    isShow,
    showMsg,
    setMsg,
  }
}
