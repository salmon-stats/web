<template>
  <require-fetch-template>
    <div v-if="records && Object.keys(records).length > 0">
      <b-tabs v-model="activeTabIndex">
        <b-tab-item label="Golden Eggs" />
        <b-tab-item label="Power Eggs" />
      </b-tabs>

      <div>
        <p>3-Wave Total Record</p>
        <schedule-record :record="records.totals[eggType]" :record-type="eggType" />
      </div>

      <table>
        <thead>
          <tr>
            <th v-for="eventId in events" :key="eventId">
              {{ eventId ? $t(getTranslationKey('event', eventId)) : '-' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="waterLevelId in waterLevels" :key="waterLevelId"
            :class="['low', 'normal', 'high'][waterLevelId - 1]">
            <td v-for="eventId in events" :key="`${waterLevelId}-${eventId}`"
              :class="isCellClicable(eventId, waterLevelId) ? 'clickable' : ''"
              @click="toResultPage(eventWaterLevelRecord(eventId, waterLevelId).id)">
              <schedule-record v-if="eventWaterLevelRecord(eventId, waterLevelId)"
                :record="eventWaterLevelRecord(eventId, waterLevelId)" :record-type="eggType" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      No records found for {{ scheduleId }}.
    </div>
  </require-fetch-template>
</template>

<style lang="scss" scoped>
@import '../assets/variables.scss';

.table-container {
  overflow-x: auto;
}
table {
  width: 35em;
}
thead, tbody {
  th, td {
    padding: .5em;
    height: 4em;
    width: 5em;
  }
}
thead th {
  text-align: center;
}
tbody {
  tr {
    background-color: $background-accent-color;
    background-image: url('../assets/high-tide.svg');
    background-position: center;
    background-repeat: repeat-x;
    background-size: auto 150%;

    &.high {
      background-position-y: -.5em;
    }
    &.normal {
      background-position-y: .5em;
    }
    &.low {
      background-position-y: 1.5em;
    }
  }
}
$border: 2px dashed darken($background-accent-color, 10%);
tbody tr {
  border-top: $border;
}
td:not(:first-child) {
  border-left: $border;
}
</style>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import ScheduleRecord from '../components/ScheduleRecord.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';
import { getTranslationKey } from '@/helper.ts';

@Component({
  name: 'ScheduleRecords',
  components: { RequireFetchTemplate, ScheduleRecord },
})
export default class ScheduleRecords extends RequireFetchBase {
  activeTabIndex = 0;

  get scheduleId() {
    return this.$route.params.scheduleId;
  }
  get eggType() {
    return ['golden_eggs', 'power_eggs'][this.activeTabIndex];
  }
  get apiPath() {
    return `schedules/${this.scheduleId}/records`;
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

  isCellClicable(eventId, waterLevelId) {
    return !!this.eventWaterLevelRecord(eventId, waterLevelId);
  }

  toResultPage(resultId) {
    this.$router.push({ name: 'results.detail', params: { resultId } });
  }

  mounted() {
    state.fetch(this.apiPath);
  }

  @Watch('$route')
  onRouteChange() {
    state.fetch(this.apiPath);
  }

  getTranslationKey = getTranslationKey;
}
</script>
