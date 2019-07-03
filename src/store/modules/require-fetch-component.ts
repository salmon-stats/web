import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store/store';
import axios from 'axios';

export interface IRequireFetchComponent {
  isLoading: boolean;
  error: null | object;
  data: null | object;
}

@Module({ dynamic: true, store, name: 'require-fetch-component', namespaced: true })
class RequireFetchComponent extends VuexModule implements IRequireFetchComponent {
  public data: null | object = null;
  public error: null | object = null;
  public isLoading = false;
  private requestCanceler: any = null;

  @Action
  public fetch(path: string) {
    if (this.isLoading) {
      this.requestCanceler();
    }

    this.SET_LOADING(true);

    const CancelToken = axios.CancelToken;
    const options: any = {
      cancelToken: new CancelToken((canceler) => {
        this.SET_CANCELER(canceler);
      }),
    };

    axios.get(VUE_APP_API_URL + `/api/${path}`, options)
      .then((res: any) => {
        this.SET_DATA(res.data);
        this.SET_LOADING(false);
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
  private SET_DATA(data: object | null) {
    this.data = data;
  }

  @Mutation
  private SET_ERROR(error: object | null) {
    this.error = error;
  }

  @Mutation
  private SET_LOADING(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}

export const requireFetchComponentModule = getModule(RequireFetchComponent);
