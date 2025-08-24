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
      path: '/json-diff',
      name: 'json-diff',
      component: () => import('@/pages/jsonDiff.vue'),
    },
    {
      path: '/json-table',
      name: 'json-table',
      component: () => import('@/pages/jsonTable.vue'),
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
      path: '/sql-list',
      name: 'sqlList',
      component: () => import('@/pages/sqlList.vue'),
      meta: { KeepAlive: true },
    },
    {
      path: '/sql-update-col',
      name: 'sqlUpdateCol',
      component: () => import('@/pages/sqlUpdateCol.vue'),
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
