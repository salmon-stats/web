import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store/store';
import axios from 'axios';
import { createApiClient } from '@/api-client';

const CancelToken = axios.CancelToken;

export type IRequireFetchComponent = {
  isLoading: boolean;
  error: null | any;
  data: null | any;
};

@Module({ dynamic: true, store, name: 'require-fetch-component', namespaced: true })
class RequireFetchComponent extends VuexModule implements IRequireFetchComponent {
  public data: null | any = null;
  public error: null | any = null;
  public isLoading = false;
  private requestCanceler: any = null;

  @Action
  public fetch(path: string) {
    if (this.isLoading) {
      this.requestCanceler();
    }

    this.SET_LOADING(true);

    const client = createApiClient({
      cancelToken: new CancelToken((canceler) => {
        this.SET_CANCELER(canceler);
      }),
    });

    return client
      .get(`/api/${path}`)
      .then((res) => {
        this.SET_DATA(res.data);
        this.SET_LOADING(false);

        return res.data;
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          this.SET_ERROR(err);
          this.SET_LOADING(false);
        }
      });
  }

  @Action
  public reset() {
    if (this.isLoading) {
      this.requestCanceler();
    }

    this.SET_DATA(null);
    this.SET_ERROR(null);
    this.SET_LOADING(false);
    this.SET_CANCELER(null);
  }

  @Mutation
  private SET_CANCELER(canceler: any) {
    this.requestCanceler = canceler;
  }

  @Mutation
  private SET_DATA(data: any | null) {
    this.data = data;
  }

  @Mutation
  private SET_ERROR(error: any | null) {
    this.error = error;
  }

  @Mutation
  private SET_LOADING(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}

export const requireFetchComponentModule = getModule(RequireFetchComponent);
