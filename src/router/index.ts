import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
// import type { RouteLocationNormalizedLoaded,ScrollPosition } from 'vue-router'
import IndexView from '../views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {// 注册
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        requiresLoading: false,// 是否需要加载动画
      }
    },
    {// 登录
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        requiresLoading: false,// 是否需要加载动画
      }
    },
    {// 重置密码
      path: '/reset',
      name: 'reset',
      component: () => import('../views/ResetView.vue'),
      meta: {
        requiresLoading: false,// 是否需要加载动画
      }
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
          component: () => import('../views/HomeView.vue'),
          meta: {
            requiresLoading: true,// 是否需要加载动画
          }
        },
        {// 活动日程
          path: '/activity',
          name: 'activity',
          component: () => import('../views/ActivityView.vue'),
          meta: {
            requiresLoading: true,// 是否需要加载动画
          }
        },
        {// 个人资料
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('../views/UserInfoView.vue'),
        },
        {// 设置
          path: '/setting',
          name: 'setting',
          component: () => import('../views/SetView.vue'),
        },
        {// 健康档案
          path: '/document',
          name: 'document',
          component: () => import('../views/DocumentView.vue'),
          meta: {
            requiresLoading: true,// 是否需要加载动画
          }
        },
        // {// 咨询服务
        //   path: '/consult',
        //   name: 'consult',
        //   component: () => import('../views/ConsultView.vue')
        // },
        {// 社交互动
          path: '/interact',
          name: 'interact',
          component: () => import('../views/InteractView.vue'),
          meta: {
            requiresLoading: true,// 是否需要加载动画
          }
        },
        {// 单页社交互动帖子
          path: '/interact/:id',
          name: 'interactDetail',
          component: () => import('../views/InteractDetailView.vue'),
          meta: {
            requiresLoading: true,// 是否需要加载动画
          }
        },
        {// 搜索社交互动帖子
          path: '/searchpost',
          name: 'searchPost',
          component: () => import('../views/SearchPostView.vue'),
        },
        {// 搜索社交互动帖子
          path: '/searchpost/:id',
          name: 'searchPostDetail',
          component: () => import('../views/InteractDetailView.vue'),
        },
        {// 健康知识库
          path: '/knowledge',
          name: 'knowledge',
          component: () => import('../views/KnowledgeView.vue'),
          meta: {
            requiresLoading: true,// 是否需要加载动画
          }
        },
        {// 单页健康知识库
          path: '/knowledge/:id',
          name: 'knowledgeDetail',
          component: () => import('../views/KnowDetailView.vue'),
          // meta: {
          //   requiresLoading: true,// 是否需要加载动画
          // }
        },
      ]
    },
  ],
})

router.beforeEach((to, from, next) => {
  // 如果目标路由需要加载数据，设置加载状态
  const store = useStore();
  if (to.meta.requiresLoading) {
    store.commit('loading/SET_LOADING', true);
  }
  next();
});

router.afterEach((to) => {
  const store = useStore();
  // 如果目标路由不需要加载数据，立即隐藏加载提示
  if (!to.meta.requiresLoading) {
    store.commit('loading/SET_LOADING', false);
  }
});

export default router
