import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store/store';
import apiCleint from '@/api-client';

type StringMap = { [key: string]: string };

export interface IIdKeyMap {
  boss: StringMap;
  event: StringMap;
  fail_reason: StringMap;
  special: StringMap;
  stage: StringMap;
  water_level: StringMap;
  weapon: StringMap;
}

const keysAsNumber = (map: StringMap): number[] => Object.keys(map).map(Number);

@Module({ dynamic: true, store, name: 'id-key-map', namespaced: true })
class IdKeyMap extends VuexModule implements IIdKeyMap {
  public boss: StringMap = {};
  public event: StringMap = {};
  public fail_reason: StringMap = {};
  public special: StringMap = {};
  public stage: StringMap = {};
  public water_level: StringMap = {};
  public weapon: StringMap = {};

  get bossIds(): string[] {
    return Object.keys(this.boss);
  }

  get stageIds(): number[] {
    return keysAsNumber(this.stage);
  }

  @Action
  public fetchIdKeyMap() {
    apiCleint.get('/id-key-map')
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
