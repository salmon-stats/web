import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store/store';

export interface IUiState {
  highlightedWeaponId: number | null;
}

@Module({ dynamic: true, store, name: 'ui-state', namespaced: true })
class UiState extends VuexModule implements IUiState {
  public highlightedWeaponId: number | null = null;

  @Action
  public setHighlightedWeaponId(weaponId: number) {
    this.SET_WEAPON_ID(weaponId);
  }

  @Action unsetHighlightedWeaponId() {
    this.SET_WEAPON_ID(null);
  }

  @Mutation
  private SET_WEAPON_ID(weaponId: number | null) {
    this.highlightedWeaponId = weaponId;
  }
}

export const uiStateModule = getModule(UiState);
