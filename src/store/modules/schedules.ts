import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store/store';
import apiCleint from '@/api-client';
import { parseRawSchedule } from '@/helper';
import { Schedule } from '@/types/salmon-stats';

export interface IScheduleStore {
  schedules: { [key: string]: Schedule };
}

@Module({ dynamic: true, store, name: 'schedulesMetadata', namespaced: true })
class ScheduleStore extends VuexModule implements IScheduleStore {
  schedules: { [key: string]: Schedule } = {};

  @Action
  public setScheduleData(rawSchedule: any) {
    this.SET_SCHEDULE_DATA(rawSchedule);
  }

  @Action
  public async fetchScheduleMetadata(scheduleId: string): Promise<Schedule> {
    if (!(scheduleId in this.schedules)) {
      const res = await apiCleint.get(`/schedules/${scheduleId}/metadata`);

      this.SET_SCHEDULE_DATA(res.data);
    }

    return this.schedules[scheduleId]!;
  }

  @Mutation
  private SET_SCHEDULE_DATA(rawSchedule: any) {
    const schedule = parseRawSchedule(rawSchedule);
    this.schedules = {
      ...this.schedules,
      [schedule.scheduleId]: schedule,
    };
  }
}

export const schedulesModule = getModule(ScheduleStore);
