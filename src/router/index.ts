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
          // meta: {
          //   requiresLoading: true,// 是否需要加载动画
          // }
        },
        {// 个人资料
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('../views/UserInfoView.vue'),
          meta: {
            requiresLoading: true,// 是否需要加载动画
          },
        },
        {// 健康档案
          path: '/document',
          name: 'document',
          component: () => import('../views/DocumentView.vue'),
          // meta: {
          //   requiresLoading: true,// 是否需要加载动画
          // }
        },
        {// 记录-测试
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
  ],
  // scrollBehavior(to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded, savedPosition: ScrollPosition | null): ScrollPosition | undefined{
  //       // 如果保存了滚动位置，直接返回
  //       if (savedPosition) {
  //           return savedPosition;
  //       }
  //     // 如果从知识详情页返回到列表页，恢复之前保存的滚动位置
  //       if (to.name === "KnowledgeView" && from.name === "KnowDetailView") {
  //           return { top: savedPosition ? parseInt(savedPosition, 10) : 0 };
  //       }


  //       // 默认返回顶部
  //       return { top: 0 };
  //   },
})

router.beforeEach((to, from, next) => {
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
