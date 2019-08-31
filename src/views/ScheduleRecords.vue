<template>
  <require-fetch-template>
    <div v-if="records && Object.keys(records).length > 0">
      <b-tabs v-model="activeTabIndex">
        <b-tab-item label="Golden Eggs" />
        <b-tab-item label="Power Eggs" />
      </b-tabs>

      <div>
        <schedule-record :record="records.totals[eggType]" :record-type="eggType" />
      </div>

      <table>
        <tr v-for="waterLevelId in waterLevels">
          <td v-for="eventId in events">
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
  name: 'ScheduleRecords',
  components: { RequireFetchTemplate, ScheduleRecord },
})
export default class ScheduleRecords extends RequireFetchBase {
  activeTabIndex = 0;

  get eggType() {
    return ['golden_eggs', 'power_eggs'][this.activeTabIndex];
  }
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
