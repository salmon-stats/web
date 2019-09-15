import { Component, Prop, Vue } from 'vue-property-decorator';
import dayjs, { Dayjs } from 'dayjs';

import { formatDateToMdhm, timeDifference } from '@/helper';
import MainWeapon from '@/components/MainWeapon.vue';
import { idKeyMapModule } from '@/store/modules/id-key-map';
import { Schedule } from '@/types/salmon-stats';

@Component({
  name: 'ScheduleCard',
  components: { MainWeapon },
})
export default class ScheduleCard extends Vue {
  @Prop({ default: formatDateToMdhm, type: Function })
  dateFormatter!: Function;

  @Prop()
  readonly differenceTo?: 'endAt' | 'startAt';

  @Prop()
  readonly now!: Dayjs;

  @Prop({ required: true })
  readonly schedule!: Schedule;

  @Prop({ default: true })
  readonly isClickable!: boolean;

  public stageKey(id: number) {
    return idKeyMapModule.stage[id.toString()];
  }

  public get scheduleSummaryRoute() {
    return {
      name: 'schedules.summary',
      params: { scheduleId: this.schedule.scheduleId },
    };
  }
  public get startAt() {
    return this.dateFormatter(this.schedule.startAt);
  }
  public get endAt() {
    return this.dateFormatter(this.schedule.endAt);
  }
  public duration = dayjs(this.schedule.endAt).diff(this.schedule.startAt, 'h');
  public get timeDifference(): undefined | string {
    if (!this.differenceTo) {
      return;
    }

    return timeDifference(this.now, this.schedule[this.differenceTo]);
  }
}
