<template>
  <require-fetch-template>
    <div v-if="playerShifts">
      <div v-for="playerShift in playerShifts" :key="playerShift.schedule_id"
        class="columns">
        <div class="column is-4">
          <schedule-card :schedule="formatSchedule(playerShift)"
            :link-to="`/players/${playerId}/schedules/${formatScheduleId(playerShift.schedule_id)}`" />
        </div>
        <shift-summary
          :shift-summary="playerShift"
          class="column is-8" />
      </div>

      <b-pagination v-if="playerShifts.length > 0"
        :total="state.total"
        :current.sync="currentPage"
        :per-page="state.per_page"
        :range-before="3"
        :range-after="3"
        icon-pack="material-icons"
        @change="paginate"
      />
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import ScheduleCard from '@/components/ScheduleCard.vue';
import ShiftSummary from '@/components/ShiftSummary.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { formatScheduleId, parseRawSchedule, percentage, toFixed, mapQueryParamsToApiPath } from '@/helper';

@Component({
  name: 'PlayerShifts',
  components: { ProportionalBarChart, RequireFetchTemplate, ScheduleCard, ShiftSummary },
  filters: { percentage, toFixed },
})
export default class PlayerShifts extends RequireFetchBase {
  currentPage = 1;
  formatScheduleId = formatScheduleId;

  get apiPath() {
    return mapQueryParamsToApiPath(`players/${this.playerId}/schedules`, this.$route.query);
  }
  get playerId() {
    return this.$route.params.playerId;
  }
  get state() {
    return state.data;
  }
  get playerShifts() {
    return this.state && this.state.data && this.state.data;
  }

  formatSchedule(shift) {
    return parseRawSchedule({
      ...shift,
      weapons: JSON.parse(shift.weapons),
    });
  }

  paginate(toPage) {
    this.$router.push(this.paginator(toPage));
  }

  paginator(toPage) {
    return {
      name: this.$route.name,
      params: { playerId: this.playerId },
      query: { page: toPage },
    };
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
