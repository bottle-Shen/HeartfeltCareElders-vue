import { createStore } from 'vuex'
import type { UserState } from './modules/user';
import type { KnowledgeState } from './modules/knowledge'
import { userModule } from './modules/user';
import { knowledgeModule } from './modules/knowledge'

export interface RootState {
  user: UserState;
  knowledge: KnowledgeState;
}

export const store = createStore<RootState>({
  modules: {
    user: userModule,
    knowledge: knowledgeModule,
  },
});

export default store;