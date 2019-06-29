import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store/store';
import axios from 'axios';
import { PlayerId, BossId } from '@/types/salmon-result';

export interface IMetadata {
  // bossIds: BossId[];
  user: null | {
    id: number;
    name: string;
    player_id: PlayerId;
    twitter_id: string;
  };
}

@Module({ dynamic: true, store, name: 'metadata', namespaced: true })
class Metadata extends VuexModule implements IMetadata {
  public bossIds = [];
  public user = null;

  @Action
  public fetchMetadata() {
    axios.get('http://localhost/metadata', { withCredentials: true })
      .then((res) => {
        const data = res.data;
        this.SET_USER_METADATA(data.user);
      });
    // TODO: fetch other metadata (e.g. bosses, weapons, ...)
  }

  @Mutation
  private SET_USER_METADATA(user: any) {
    this.user = user;
  }
}

export const metadataModule = getModule(Metadata);
