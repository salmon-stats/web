import dayjs, { Dayjs } from 'dayjs';
import { Component, Vue } from 'vue-property-decorator';

import ScheduleCard from '@/components/ScheduleCard';
import { metadataModule } from '@/store/modules/metadata';
import { Schedule } from '@/types/salmon-stats';

@Component({
  name: 'Home',
  components: { ScheduleCard },
})
export default class PlayerPeers extends Vue {
  public now: Dayjs = dayjs();
  private timerId?: number;

  public get isSchedulesAvailable(): boolean {
    return this.schedules.length > 0;
  }

  public get upcomingSchedules(): Schedule[] {
    return this.schedules.filter((schedule) => this.now.isBefore(schedule.startAt));
  }

  public get ongoingSchedule(): Schedule | null {
    return this.schedules.find((schedule) =>
      this.now.isBefore(schedule.endAt) && this.now.isAfter(schedule.startAt)) || null;
  }

  public get pastSchedules(): Schedule[] {
    return this.schedules
      .filter((schedule) => this.now.isAfter(schedule.endAt))
      .slice()
      .reverse();
  }

  public mounted() {
    this.timerId = setInterval(() => this.now = dayjs(), 1000);
  }

  public beforeDestroy() {
    clearInterval(this.timerId);
  }

  private get schedules(): Schedule[] {
    return metadataModule.schedules || [];
  }
}
