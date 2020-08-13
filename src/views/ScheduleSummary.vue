<template>
  <require-fetch-template>
    <template v-if="schedule">
      <div v-if="records">
        <div class="page-section">
          <h2>Results</h2>
          <results :hide-schedule-heading="true" :raw-results="results" :show-more-link="scheduleResultsPage(this.scheduleId)" />
        </div>

        <div class="is-flex page-section">
          <h2>Records</h2>
          <b-radio v-model="recordType" native-value="golden_eggs">
            <img src="@/assets/golden-egg.png" /><span>Golden Eggs</span>
          </b-radio>
          <b-radio v-model="recordType" native-value="power_eggs">
            <img src="@/assets/power-egg.png" /><span>Power Eggs</span>
          </b-radio>
        </div>
        <div class="records">
          <h3>3-Wave Total Records</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th><div class="v-center"><img src="@/assets/golden-egg.png" /><span class="is-hidden-mobile">Golden Eggs</span></div></th>
                  <th><div class="v-center"><img src="@/assets/power-egg.png" /><span class="is-hidden-mobile">Power Eggs</span></div></th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                <schedule-record-row
                  v-for="key in ['totals', 'no_night_totals']"
                  :is-valid-event="true"
                  :key="key"
                  :heading="key === 'totals' ? 'All' : 'No Night'"
                  :records="records[key]"
                  :record-type="recordType"
                />
              </tbody>
            </table>
          </div>

          <div class="is-flex page-section">
            <h3>Wave Records</h3>
            <strong>Tide</strong>
            <b-field>
              <b-slider
                type="is-info"
                :min="1"
                :max="3"
                aria-label="Tide"
                v-model="selectedWaterLevel"
                :custom-formatter="(waterLevelId) => $t(getTranslationKey('water_level', waterLevelId))"
              >
                <b-slider-tick :value="1">Low</b-slider-tick>
                <b-slider-tick :value="2">Mid</b-slider-tick>
                <b-slider-tick :value="3">High</b-slider-tick>
              </b-slider>
            </b-field>
          </div>

          <div v-for="waterLevelId in waterLevels" :key="waterLevelId">
            <div v-show="waterLevelId === selectedWaterLevel" class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th><div class="v-center"><img src="@/assets/golden-egg.png" /><span class="is-hidden-mobile">Golden Eggs</span></div></th>
                    <th><div class="v-center"><img src="@/assets/power-egg.png" /><span class="is-hidden-mobile">Power Eggs</span></div></th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="eventId in events">
                    <schedule-record-row
                      :is-valid-event="isValidEventForWaterLevel(waterLevelId, eventId)"
                      :key="`${waterLevelId}-${eventId}`"
                      :heading="eventId ? $t(getTranslationKey('event', eventId)) : 'No Event'"
                      :records="eventWaterLevelRecord(eventId, waterLevelId)"
                      :record-type="recordType"
                    />
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        No records found for
        <schedule :date-formatter="formatDateToYmdhm" :is-link-disabled="true" :schedule-id="scheduleId" />.
      </div>
    </template>
  </require-fetch-template>
</template>

<script>
import { Component, Watch } from 'vue-property-decorator';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import Schedule from '@/components/Schedule.vue';
import ScheduleCard from '@/components/ScheduleCard.vue';
import ScheduleRecordRow, { eggKinds } from '@/components/ScheduleRecordRow.vue';
import Results from '@/components/Results.vue';
import { waterLevelEventTable } from '@/constants';
import { formatDateToYmdhm, getTranslationKey, parseRawSchedule, unique } from '@/helpers/helper';
import RouterHelperMixin from '@/helpers/router-helper';
import { metadataModule } from '@/store/modules/metadata';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';
import { playersModule } from '@/store/modules/players';
import { schedulesModule } from '@/store/modules/schedules';

@Component({
  name: 'ScheduleRecords',
  components: { Results, RequireFetchTemplate, Schedule, ScheduleCard, ScheduleRecordRow },
  mixins: [RouterHelperMixin],
})
export default class ScheduleRecords extends RequireFetchBase {
  recordType = 'golden_eggs';
  formatDateToYmdhm = formatDateToYmdhm;
  getTranslationKey = getTranslationKey;
  selectedWaterLevel = 2;

  get myPlayerId() {
    return metadataModule.myPlayerId;
  }

  get scheduleId() {
    return this.$route.params.scheduleId;
  }
  get apiPath() {
    return `schedules/${this.scheduleId}`;
  }
  get schedule() {
    if (!state.data || !('schedule' in state.data)) {
      return;
    }

    return parseRawSchedule(state.data.schedule);
  }
  get records() {
    if (!state.data || !('records' in state.data)) {
      return;
    }

    return state.data.records;
  }
  get results() {
    if (!state.data || !('results' in state.data)) {
      return;
    }

    return state.data.results;
  }
  get waterLevels() {
    return Object.keys(idKeyMap.water_level).map((id) => parseInt(id, 10));
  }
  get events() {
    return Object.keys(idKeyMap.event).map((id) => parseInt(id, 10));
  }

  eventWaterLevelRecord(eventId, waterLevelId) {
    return Object.fromEntries(eggKinds.map((eggKind) => [
      eggKind,
      this.records.wave_records[eggKind].find(
        (record) => record.event_id === eventId && record.water_id === waterLevelId,
      ),
    ]));
  }

  isValidEventForWaterLevel(waterLevelId, eventId) {
    return waterLevelEventTable[waterLevelId].includes(eventId);
  }

  fetch() {
    state.fetch(this.apiPath).then((res) => {
      if (!res) {
        return;
      }

      schedulesModule.setScheduleData(res.schedule);

      if (!state.data.records) {
        return;
      }

      const { totals, no_night_totals, wave_records } = state.data.records;
      const recordHolderIds = unique([totals, no_night_totals, wave_records.golden_eggs, wave_records.power_eggs]
        .flatMap(Object.values)
        .filter(Boolean)
        .flatMap((record) => record.members));

      playersModule.fetchPlayers(recordHolderIds);
    });
  }

  mounted() {
    this.fetch();
  }

  @Watch('$route')
  onRouteChange() {
    this.fetch();
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/bulma-variables.scss';
@import '../assets/variables.scss';

.schedule-card-container {
  margin-bottom: 1em !important;
}

.table-container {
  overflow-x: auto;
}
.table-wrap, table {
  width: 100%;
}

@media (min-width: $tablet) {
  table {
    table-layout: fixed;
  }
}

thead,
tbody {
  th,
  td,
  ::v-deep th,
  ::v-deep td {
    padding: 0.5em;
    height: 4em;

    &:first-child {
      text-align: right;
      padding-right: 1.5em !important;
    }

    @media (max-width: $tablet - 1) {
      &:nth-child(1) {
        width: 30%;
      }
      &:nth-child(2),
      &:nth-child(3) {
        width: 15%;
      }
    }
  }
}

.records {
  max-width: 100%;
}

strong {
  width: 6em;
  text-align: right;
  margin-right: 1em;
}

.b-radio {
  font-weight: bold;
  &:not(:last-child) {
    margin-right: 1em;
  }

  ::v-deep .control-label {
    display: flex;
    align-items: center;
  }
}

::v-deep .field {
  padding: 0 1em;
  @media (min-width: $tablet) {
    width: calc(100% - 15em);
  }
  @media (max-width: $tablet - 1) {
    width: 100%;
  }
}

.is-flex {
  align-items: center;
  margin-bottom: .5em;

  h2,
  h3 {
    margin-right: 1em;
    margin-bottom: 0;
  }
}

img {
  height: 16px;
  &+span {
    margin-left: .5em;
  }
}

h3 {
  margin-bottom: .5em;
}

.page-section:not(:first-child) {
  margin-top: 1em;
}

.v-center {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
