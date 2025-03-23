// Composables
import { useAppStore } from '@/store/app'
import { nextTick } from 'vue'
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
        props: { icon: 'mdi-view-list', subs: 'Inspection Tool Control List' },
        path: '/home/list',
        name: 'Tool Control List',
        component: () => import('@/views/pages/controlList.vue'),
      },
      {
        props: { icon: 'mdi-view-day', subs: 'Daily Tool Control' },
        path: '/home/daily',
        name: 'Daily Control',
        component: () => import('@/views/features/dailyInspection.vue'),
      },
      {
        props: { icon: 'mdi-view-week', subs: 'Weekly Tool Control' },
        path: '/home/weekly',
        name: 'Weekly Control',
        component: () => import('@/views/features/weeklyInspection.vue'),
      },
      {
        props: { icon: 'mdi-calendar', subs: 'Monthly Tool Control' },
        path: '/home/monthly',
        name: 'Monthly Control',
        component: () => import('@/views/features/monthlyInspection.vue'),
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

router.beforeEach(async (e) => {
  const store = useAppStore()
  const path = e.path
  const sessionId = store.sessionId
  store.preload = true

  if (path == '/' || path == '/login') {
    if (sessionId != "") {

      const home = await store.ajax({ sessionId }, 'auth/gethome', 'post')
      router.push(home)
      return
    }
  } else {
    if (sessionId == "") {
      router.push('/login')
      return
    } else {
      const match = e.matched.length
      if (match < 1) {
        const home = await store.ajax({ sessionId }, 'auth/gethome', 'post')
        router.push(home)
        return
      }
    }
  }
})
router.afterEach(async () => {
  const store = useAppStore()

  await router.isReady()
  await nextTick()
  setTimeout(() => {
    store.preload = false
  }, 700)

})


