<template>
  <require-fetch-template>
    <schedule-card v-if="schedule" :schedule="schedule" />

    <template v-if="shiftSummary">
      <div class="columns reverse-row-order">
        <div class="column is-9">
          <shift-details
            :is-detail="true"
            :normalize-failed-game="normalizeFailedGame"
            :player-name="player && player.name"
            :shift-summaries="[{
              isGlobal: false,
              ...summary,
              rescue: summary.player_rescue,
              death: summary.player_death,
            },
            {
              isGlobal: true,
              ...shiftSummary.global,
              rescue: shiftSummary.global.rescue,
            }]"
          />
        </div>

        <section class="column is-3">
          <h2>Main weapons</h2>
          <div class="table-wrap box is-fullwidth">
            <table class="is-hoverable is-fullwidth">
              <tbody>
                <tr v-for="weapon in shiftSummary.weapons" :key="weapon.weapon_id">
                  <td><main-weapon :weapon-id="weapon.weapon_id" :size="32" /></td>
                  <td>{{ weapon.count }} <small class="weak">({{ weapon.count / (summary.clear_waves + summary.games - summary.clear_games) | percentage }})</small></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section>
        <h2>Results</h2>
        <results
          :hide-schedule-heading="true"
          :raw-results="shiftSummary.results"
          :show-more-link="showMoreLink" />
      </section>
    </template>
  </require-fetch-template>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

</style>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import MainWeapon from '@/components/MainWeapon';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import Results from '../components/Results.vue';
import ScheduleCard from '@/components/ScheduleCard';
import ShiftDetails from '@/components/ShiftDetails';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { playersModule } from '@/store/modules/players';
import { schedulesModule } from '@/store/modules/schedules';
import { parseRawSchedule, percentage, toFixed } from '@/helper';

@Component({
  name: 'PlayerShifts',
  components: { MainWeapon, ProportionalBarChart, RequireFetchTemplate, ScheduleCard, ShiftDetails, Results },
  filters: { percentage, toFixed },
})
export default class PlayerShifts extends RequireFetchBase {
  normalizeFailedGame = false;
  player = null;
  schedule = null;

  get apiPath() {
    return `players/${this.playerId}/schedules/${this.scheduleId}`;
  }
  get playerId() {
    return this.$route.params.playerId;
  }
  get scheduleId() {
    return this.$route.params.scheduleId;
  }
  get shiftSummary() {
    return state.data;
  }
  get showMoreLink() {
    return {
      name: 'players.schedules.results',
      params: { scheduleId: this.scheduleId },
    };
  }
  get summary() {
    const summary = state.data.summary;
    const result = {};

    Object.entries(summary).forEach((pair) => {
      const [k, v] = pair;

      if (k.substr(0, 6) === 'player') {
        const key = k.substr(7);
        result[`team_${key}`] = v + summary[`others_${key}`];
        result[k] = v;
      }
      else {
        result[k] = v;
      }
    });

    return result;
  }

  mounted() {
    state.fetch(this.apiPath);

    schedulesModule.fetchScheduleMetadata(this.scheduleId)
      .then((schedule) => { this.schedule = schedule; });

    playersModule.fetchPlayer(this.playerId)
      .then((player) => { this.player = player; })
  }
}
</script>
