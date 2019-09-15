<template>
  <div>
    <div class="columns">
      <div v-if="schedule" class="column is-one-third">
        <schedule-card :schedule="schedule" />
      </div>
    </div>

    <router-view class="body" />
  </div>
</template>

<style scoped>
.body {
  margin-top: 1em;
}
</style>

<script>
import { mapState } from 'vuex';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { schedulesModule } from '@/store/modules/schedules';
import Schedule from '@/components/Schedule.vue';
import ScheduleCard from '@/components/ScheduleCard.vue';

@Component({
  name: 'ScheduleBase',
  components: { Schedule, ScheduleCard },
  computed: {
    ...mapState('schedulesMetadata', {
      schedules: state => state.schedules,
    }),
  },
})
export default class ScheduleBase extends Vue {
  isLoadingSchedule = false;
  schedule = null;

  get title() {
    return {
      'schedules.summary': 'Summary',
    }[this.$route.name];
  }
  get scheduleId() {
    return this.$route.params.scheduleId;
  }
  get nextSchedule() {
    if (!this.schedule || !this.schedule.nextScheduleId) return;

    return schedulesModule.schedules.get(this.schedule.nextScheduleId);
  }
  get previousSchedule() {
    if (!this.schedule || !this.schedule.prevScheduleId) return;

    return schedulesModule.schedules.get(this.schedule.prevScheduleId);
  }

  fetchScheduleMetadata() {
    if (this.$route.name === 'schedules.summary') {
      return;
    }

    this.isLoadingScheduleMetadata = true;

    schedulesModule.fetchScheduleMetadata(this.scheduleId)
      .then((schedule) => {
        this.schedule = schedule;
      })
      .finally(() => this.isLoadingScheduleMetadata = false);
  }

  mounted() {
    this.onChangeScheduleId();
  }

  @Watch('scheduleId')
  onChangeScheduleId() {
    if (this.$route.name === 'schedules.summary') {
      this.schedule = this.schedules[this.$route.params.scheduleId] || null;
    }
    else {
      this.schedule = null;
      this.fetchScheduleMetadata();
    }
  }

  @Watch('schedules')
  onChangeSchedules(newSchedules) {
    this.onChangeScheduleId();
  }
}
</script>
