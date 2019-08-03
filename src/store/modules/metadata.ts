import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store/store';
import axios from 'axios';
import { PlayerId } from '@/types/salmon-result';

export interface IMetadata {
  user: null | {
    id: number;
    name: string;
    player_id: PlayerId;
    twitter_id: string;
  };
}

@Module({ dynamic: true, store, name: 'metadata', namespaced: true })
class Metadata extends VuexModule implements IMetadata {
  public user = null;
  public hasSessionExpired = false;
  public lastFetchedTime = 0;

  @Action
  public fetchMetadata() {
    // TODO: fetch other metadata (e.g. bosses, weapons, ...)
    // @ts-ignore
    return axios.get(VUE_APP_API_URL + '/metadata', { withCredentials: true })
      .then((res) => {
        const data = res.data;
        this.SET_USER_METADATA(data.user);
        this.SET_LAST_FETCHED_TIME(new Date().getTime());
        return data;
      });
  }

  @Action
  public refreshSession() {
    if (this.hasSessionExpired || this.user === null) {
      return;
    }

    this.fetchMetadata()
      .then((data) => {
        if (data.user === null) {
          this.SET_SESSION_EXPIRED_TRUE();
        }
      });
  }

  @Mutation
  private SET_SESSION_EXPIRED_TRUE() {
    this.hasSessionExpired = true;
  }

  @Mutation
  private SET_LAST_FETCHED_TIME(time: number) {
    this.lastFetchedTime = time;
  }

  @Mutation
  private SET_USER_METADATA(user: any) {
    this.user = user;
  }
}

export const metadataModule = getModule(Metadata);
