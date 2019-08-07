<template>
  <div>
    <router-link :to="`/results/${record.id}`">{{ record.id }}</router-link>

    {{ value }}

    <div v-if="record.water_id">
      {{ $t(getTranslationKey('water_level', record.water_id)) }}
      <span v-if="record.event_id !== 0">
        {{ $t(getTranslationKey('event', record.event_id)) }}
      </span>
      <span v-else>-</span>
    </div>
  </div>
</template>

<script>
import { getTranslationKey } from '@/helper.ts';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'ScheduleRecord',
  props: {
    record: Object,
    recordType: String,
  },
})
export default class ScheduleRecord extends Vue {
  get value() { return this.record[this.recordType]; }

  getTranslationKey = getTranslationKey;
}
</script>
