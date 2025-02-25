import { createStore } from 'vuex'
import type { UserState } from './modules/user';
import type { KnowledgeState } from './modules/knowledge'
import type { ActivityState } from './modules/activities'
import { userModule } from './modules/user';
import { knowledgeModule } from './modules/knowledge'
import { ActivityModule } from './modules/activities'


export interface RootState {
  user: UserState;
  knowledge: KnowledgeState;
  activities: ActivityState;
}

export const store = createStore<RootState>({
  modules: {
    user: userModule,
    knowledge: knowledgeModule,
    activities: ActivityModule,
  },
});

export default store;