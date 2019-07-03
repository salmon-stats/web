import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store/store';
import apiCleint from '@/api-client';

export interface IIdKeyMap {
  boss: object;
  event: object;
  fail_reason: object;
  special: object;
  stage: object;
  water_level: object;
  weapon: object;
}

@Module({ dynamic: true, store, name: 'id-key-map', namespaced: true })
class IdKeyMap extends VuexModule implements IIdKeyMap {
  public boss: object = {};
  public event: object = {};
  public fail_reason: object = {};
  public special: object = {};
  public stage: object = {};
  public water_level: object = {};
  public weapon: object = {};

  @Action
  public fetchIdKeyMap() {
    apiCleint.get('id-key-map')
      .then((res) => {
        this.SET_ID_KEY_MAP(res.data);
      });
  }

  @Mutation
  private SET_ID_KEY_MAP(idKeyMap: any) {
    this.boss = idKeyMap.boss;
    this.event = idKeyMap.event;
    this.fail_reason = idKeyMap.fail_reason;
    this.special = idKeyMap.special;
    this.stage = idKeyMap.stage;
    this.water_level = idKeyMap.water_level;
    this.weapon = idKeyMap.weapon;
  }
}

export const idKeyMapModule = getModule(IdKeyMap);
