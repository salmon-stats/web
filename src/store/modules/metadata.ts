import axios from 'axios';
import dayjs from 'dayjs';
import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';

import store from '@/store/store';
import { Schedule, User } from '@/types/salmon-stats';

export interface IMetadata {
  user: null | User;
  schedules: null | Schedule[];
  hasSessionExpired: boolean;
  lastFetchedTime: number;
}

function parseRawSchedule(rawSchedule: any): Schedule {
  const startAt = dayjs.utc(rawSchedule.schedule_id);
  const endAt = dayjs.utc(rawSchedule.end_at);

  return {
    scheduleId: startAt.format('YYYYMMDDhh'),
    startAt: startAt.toDate(),
    endAt: endAt.toDate(),
    weapons: rawSchedule.weapons,
    stageId: rawSchedule.stage_id,
    rareWeaponId: rawSchedule.rare_weapon_id,
  };
}

@Module({ dynamic: true, store, name: 'metadata', namespaced: true })
class Metadata extends VuexModule implements IMetadata {
  public user: null | User = null;
  public schedules: null | Schedule[] = null;
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
        this.SET_SCHEDULE_METADATA(data.schedules);
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

  @Mutation
  private SET_SCHEDULE_METADATA(schedules: any) {
    const collator = new Intl.Collator('en', { numeric: true });
    this.schedules = schedules
      .map(parseRawSchedule)
      .sort((a: Schedule, b: Schedule) => collator.compare(a.scheduleId, b.scheduleId));
  }
}

export const metadataModule = getModule(Metadata);
