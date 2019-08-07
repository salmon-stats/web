<template>
  <require-fetch-template>
    <div v-if="records">
      <a @click="eggType = 'power_eggs'">Power eggs</a>
      <a @click="eggType = 'golden_eggs'">Golden eggs</a>

      <h1>{{ eggType }}</h1>

      <div>
        <schedule-record :record="records.totals[eggType]" :record-type="eggType" />
      </div>

      <table>
        <tr v-for="eventId in events">
          <td v-for="waterLevelId in waterLevels">
            <schedule-record v-if="eventWaterLevelRecord(eventId, waterLevelId)"
              :record="eventWaterLevelRecord(eventId, waterLevelId)" :record-type="eggType" />
          </td>
        </tr>
      </table>
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import ScheduleRecord from '../components/ScheduleRecord.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';

@Component({
  name: 'PlayerSummary',
  components: { RequireFetchTemplate, ScheduleRecord },
})
export default class PlayerSummary extends RequireFetchBase {
  eggType = 'golden_eggs';

  get apiPath() {
    return `schedules/${this.$route.params.scheduleId}/records`;
  }
  get records() {
    return state.data;
  }
  get waterLevels() {
    return Object.keys(idKeyMap.water_level).map(id => parseInt(id, 10));
  }
  get events() {
    return Object.keys(idKeyMap.event).map(id => parseInt(id, 10));
  }

  eventWaterLevelRecord(eventId, waterLevelId) {
    return this.records.wave_records[this.eggType].find(
      record => record.event_id === eventId && record.water_id === waterLevelId,
    );
  }

  mounted() {
    state.fetch(this.apiPath);
  }

  @Watch('$route')
  onRouteChange() {
    state.fetch(this.apiPath);
  }
}
</script>
