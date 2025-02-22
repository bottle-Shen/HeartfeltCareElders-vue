import { createStore } from 'vuex'
import type { UserState } from './modules/user';
import type { ArticleState } from './modules/article'
import { userModule } from './modules/user';
import { articleModule } from './modules/article'

export interface RootState {
  user: UserState;
  article: ArticleState;
}

export const store = createStore<RootState>({
  modules: {
    user: userModule,
    article: articleModule,
  },
});

export default store;