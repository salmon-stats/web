import { Component, Prop, Vue } from 'vue-property-decorator';
import dayjs, { Dayjs } from 'dayjs';

import { timeDifference } from '@/helper';
import MainWeapon from '@/components/MainWeapon.vue';
import { Schedule } from '@/types/salmon-stats';

@Component({
  name: 'ScheduleCard',
  components: { MainWeapon },
})
export default class ScheduleCard extends Vue {
  @Prop()
  readonly differenceTo?: 'endAt' | 'startAt';

  @Prop()
  readonly now!: Dayjs;

  @Prop()
  readonly schedule!: Schedule;

  public startAt = dayjs(this.schedule.startAt).format('MM-DD HH:mm');
  public endAt = dayjs(this.schedule.endAt).format('MM-DD HH:mm');
  public duration = dayjs(this.schedule.endAt).diff(this.schedule.startAt, 'h');
  public get timeDifference(): undefined | string {
    if (!this.differenceTo) {
      return;
    }

    return timeDifference(this.now, this.schedule[this.differenceTo]);
  }
}
