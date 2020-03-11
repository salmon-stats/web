import Vue from 'vue';
import Vuex from 'vuex';

import { IMetadata } from '@/store/modules/metadata';

Vue.use(Vuex);

export interface State {
  metadata: IMetadata;
}
export default new Vuex.Store<State>({});
