import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: 'Tổng quan' },
        },
        {
          path: 'notes',
          name: 'notes',
          component: () => import('@/views/NotesView.vue'),
          props: { filter: 'all' },
          meta: { title: 'Tất cả ghi chú' },
        },
        {
          path: 'pinned',
          name: 'pinned',
          component: () => import('@/views/NotesView.vue'),
          props: { filter: 'pinned' },
          meta: { title: 'Ghi chú đã ghim' },
        },
        {
          path: 'archived',
          name: 'archived',
          component: () => import('@/views/NotesView.vue'),
          props: { filter: 'archived' },
          meta: { title: 'Lưu trữ' },
        },
        {
          path: 'trash',
          name: 'trash',
          component: () => import('@/views/NotesView.vue'),
          props: { filter: 'trash' },
          meta: { title: 'Thùng rác' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Không tìm thấy trang' },
    },
  ],
})

router.afterEach((route) => {
  document.title = `${String(route.meta.title ?? 'Ghi chú')} · Nhớ Notes`
})

export default router
