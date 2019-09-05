<template>
  <require-fetch-template>
    <template v-if="schedule">
      <schedule-card :schedule="schedule" />

      <div v-if="records">

        <h2>Results</h2>
        <results :raw-results="results" />

        <b-tabs v-model="activeTabIndex">
          <b-tab-item label="Golden Eggs" />
          <b-tab-item label="Power Eggs" />
        </b-tabs>

        <h2>Records</h2>

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
    </template>
  </require-fetch-template>
</template>

<style lang="scss" scoped>
@import '../assets/variables.scss';

$cell-width: 6em;

.table-container {
  overflow-x: auto;
}
table {
  width: $cell-width * 7;
}
thead, tbody {
  th, td {
    padding: .5em;
    height: 4em;
    width: $cell-width;
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
import ScheduleCard from '../components/ScheduleCard.vue';
import ScheduleRecord from '../components/ScheduleRecord.vue';
import Results from '../components/Results.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';
import { getTranslationKey, parseRawSchedule } from '@/helper.ts';

@Component({
  name: 'ScheduleRecords',
  components: { Results, RequireFetchTemplate, ScheduleCard, ScheduleRecord },
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
    return `schedules/${this.scheduleId}`;
  }
  get schedule() {
    if (!state.data || !('schedule' in state.data)) return;

    return parseRawSchedule(state.data.schedule);
  }
  get records() {
    if (!state.data || !('records' in state.data)) return;

    return state.data.records;
  }
  get results() {
    if (!state.data || !('results' in state.data)) return;

    return state.data.results;
  }
  get waterLevels() {
    return Object.keys(idKeyMap.water_level).map(id => parseInt(id, 10));
  }
  get events() {
    return Object.keys(idKeyMap.event).map(id => parseInt(id, 10));
  }
  get showMoreLink() {
    return {
      name: 'schedules.results',
      params: { scheduleId: this.scheduleId },
    };
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
