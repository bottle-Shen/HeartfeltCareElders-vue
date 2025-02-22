import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {// 注册
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {// 登录
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {// 重置密码
      path: '/reset',
      name: 'reset',
      component: () => import('../views/ResetView.vue')
    },
    {
      path: '/',
      name: '/',
      component: IndexView,
      redirect: '/index',
      children: [
        {// 首页
          path: '/index',
          name: 'index',
          component: () => import('../views/HomeView.vue')
        },
        {// 工作台
          path: '/worktable',
          name: 'worktable',
          component: () => import('../views/WorktableView.vue')
        },
        {// 个人资料
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('../views/UserInfoView.vue')
        },
        {// 健康档案
          path: '/record',
          name: 'record',
          component: () => import('../views/RecordView.vue')
        },
        {// 咨询服务
          path: '/consult',
          name: 'consult',
          component: () => import('../views/ConsultView.vue')
        },
        {// 社交互动
          path: '/interact',
          name: 'interact',
          component: () => import('../views/InteractView.vue')
        },
        {// 健康知识库
          path: '/knowledge',
          name: 'knowledge',
          component: () => import('../views/KnowledgeView.vue')
        },
        {
          path: '/test',
          name: 'test',
          component: () => import('../views/testView.vue')
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
