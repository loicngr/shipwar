import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => await import('layouts/MainLayout.vue'),
    children: [{
      path: '', component: async () => await import('pages/IndexPage.vue'),
    }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: async () => await import('pages/ErrorNotFound.vue'),
  },
]

export default routes
