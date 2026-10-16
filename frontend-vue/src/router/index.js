import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'students',
      component: () => import('../views/StudentsView.vue')
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/CoursesView.vue')
    },
    {
      path: '/enrollments',
      name: 'enrollments',
      component: () => import('../views/EnrollmentsView.vue')
    }
  ]
})

export default router