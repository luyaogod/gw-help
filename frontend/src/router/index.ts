import { createRouter, createWebHashHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/json5',
    },
    {
      path: '/json5',
      name: 'json5',
      component: () => import('@/pages/json5.vue'),
      meta: { KeepAlive: true },
    },
    {
      path: '/json-format',
      name: 'json-format',
      component: () => import('@/pages/jsonF.vue'),
      meta: { KeepAlive: true },
    },
    {
      path: '/json-diff',
      name: 'json-diff',
      component: () => import('@/pages/jsonDiff.vue'),
    },
    {
      path: '/qq-invoice',
      name: 'qq-invoice',
      component: () => import('@/pages/qqInvoice.vue'),
      meta: { KeepAlive: true },
    },
    {
      path: '/visio2',
      name: 'visio2',
      component: () => import('@/pages/visio2.vue'),
      meta: { KeepAlive: true },
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/pages/test.vue'),
      meta: { KeepAlive: true },
    },
  ],
})

export default router
