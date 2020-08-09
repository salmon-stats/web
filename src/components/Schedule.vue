<template>
  <span v-if="isLinkDisabled">
    {{ dateFormatter(scheduleId) }}
  </span>
  <span v-else>
    <router-link :to="`/schedules/${formatScheduleId(scheduleId)}`">
      {{ dateFormatter(scheduleId) }}
    </router-link>
  </span>
</template>

<style scoped>
a {
  color: inherit;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { formatDateToMdhm, formatScheduleId, DateFormatter } from '@/helpers/helper';

@Component({
  name: 'Schedule',
})
export default class Schedule extends Vue {
  @Prop({ default: formatDateToMdhm, type: Function })
  dateFormatter!: DateFormatter;

  @Prop({ default: false })
  isLinkDisabled!: boolean;

  @Prop({ required: true })
  scheduleId!: string | Date;

  formatScheduleId = formatScheduleId;
}
</script>
