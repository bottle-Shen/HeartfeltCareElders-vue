import { createStore } from 'vuex'
import { userModule,type UserState } from './modules/user';
import { knowledgeModule,type KnowledgeState } from './modules/knowledge'
import { ActivityModule,type ActivityState } from './modules/activities'
import { AsideVisibleModule,type AsideVisibleState } from './modules/asidevisible'
import { PostModule, type PostState } from './modules/post'
import { LoadingModule, type LoadingState } from './modules/loading';


export interface RootState {
  user: UserState;
  knowledge: KnowledgeState;
  activities: ActivityState;
  asideVisible: AsideVisibleState;
  post: PostState;
  loading: LoadingState; // 全局加载状态
}

export const store = createStore<RootState>({
  modules: {
    user: userModule,
    knowledge: knowledgeModule,
    activities: ActivityModule,
    asideVisible: AsideVisibleModule,
    post: PostModule,
    loading: LoadingModule,
  },
});

export default store;
// export type AppStore = typeof store;