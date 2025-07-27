import { createRouter, createWebHashHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/pages/index.vue'),
      meta: { KeepAlive: true },
    },
    {
      path: '/page2',
      name: 'page2',
      component: () => import('@/pages/page2.vue'),
      meta: { KeepAlive: true },
    },
  ],
})

export default router
