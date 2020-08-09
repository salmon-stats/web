import { Component, Prop, Vue } from 'vue-property-decorator';
import dayjs, { Dayjs } from 'dayjs';

import { formatDateToMdhm, timeDifference, DateFormatter } from '@/helpers/helper';
import MainWeapon from '@/components/MainWeapon.vue';
import { idKeyMapModule } from '@/store/modules/id-key-map';
import { Schedule } from '@/types/salmon-stats';

@Component({
  name: 'ScheduleCard',
  components: { MainWeapon },
})
export default class ScheduleCard extends Vue {
  @Prop({ default: formatDateToMdhm, type: Function })
  dateFormatter!: DateFormatter;

  @Prop()
  readonly differenceTo?: 'endAt' | 'startAt';

  @Prop()
  readonly now!: Dayjs;

  @Prop({ required: true })
  readonly schedule!: Schedule;

  @Prop({ default: true })
  readonly isClickable!: boolean;

  @Prop({ default: false })
  readonly isCompact!: boolean;

  @Prop()
  readonly linkTo?: string;

  public duration = dayjs(this.schedule.endAt).diff(this.schedule.startAt, 'h');

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
  public get timeDifference(): undefined | string {
    if (!this.differenceTo) {
      return;
    }

    return timeDifference(this.now, this.schedule[this.differenceTo]);
  }
}
