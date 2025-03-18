// Composables
import { useAppStore } from '@/store/app'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/defaultLayout'),
    children: [
      {
        path: '',
        component: () => import('@/views/pages/landingPage.vue'),
      },
      {
        path: '/login',
        component: () => import('@/views/pages/loginPage.vue'),
      },
    ],
  },
  {
    path: '/home',
    component: () => import('@/layouts/mainLayout.vue'),
    children: [
      {
        path: '/home/dashboard',
        name: 'Main Dashboard',
        component: () => import('@/views/pages/dashboardPage.vue'),
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

router.beforeEach((e) => {
  const store = useAppStore()
  const path = e.path
  const sessionId = store.sessionId
  if (path != '/') {
    store.preload = true
  }

  if (path == '/' || path == '/login') {
    if (sessionId != "") {
      router.push('/home/dashboard')
      return
    }
  } else {
    if (sessionId == "") {
      router.push('/login')
      return
    }
  }
})


