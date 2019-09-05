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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { formatDateToMdhm, formatScheduleId } from '@/helper';

@Component({
  name: 'Schedule',
})
export default class Schedule extends Vue {
  @Prop({ default: formatDateToMdhm, type: Function })
  dateFormatter!: Function;

  @Prop({ default: false })
  isLinkDisabled!: boolean;

  @Prop({ required: true })
  scheduleId!: string | Date;

  formatScheduleId = formatScheduleId;
}
</script>