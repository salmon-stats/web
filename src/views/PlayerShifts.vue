<template>
  <require-fetch-template>
    <div v-if="playerShifts">
      <div>
        <div v-for="playerShift in playerShifts" :key="playerShift.schedule_id" class="columns">
          <div class="column is-4">
            <!-- TODO: :link-to -->
            <schedule-card :schedule="formatSchedule(playerShift)" />
          </div>
          <div class="column is-8">
            <div class="summary">
              <span class="leading">Cleared/Total games</span>
              <div>
                <p>
                  {{ playerShift.clear_games }}/{{ playerShift.games }}
                  <small class="weak">({{ (playerShift.clear_games / playerShift.games) | percentage }})</small>
                </p>
                <span class="bar-container">
                  <proportional-bar-chart chart-key="win-loss"
                    :fill-remainder="true"
                    :value="playerShift.clear_games"
                    :max="playerShift.games" />
                </span>
              </div>

              <span class="leading">Average waves cleared</span>
              <div>
                <p>
                  {{ (playerShift.clear_waves / playerShift.games) | toFixed(2) }}
                </p>
                <span class="bar-container">
                  <proportional-bar-chart chart-key="win-loss"
                    :fill-remainder="true"
                    :value="playerShift.clear_waves"
                    :max="playerShift.games * 3" />
                </span>
              </div>

              <span class="leading">Rescue/Death</span>
              <div>
                <p>
                  {{ playerShift.rescue }}
                  /
                  {{ playerShift.death }}
                </p>
                <span class="bar-container">
                  <proportional-bar-chart chart-key="rescue-death"
                    :fill-remainder="true"
                    :value="playerShift.rescue"
                    :max="playerShift.rescue + playerShift.death" />
                </span>
              </div>

              <span class="leading">Boss elimination</span>
              <div>
                <p>
                  {{ playerShift.player_boss_elimination_count }}
                  /
                  {{ playerShift.team_boss_elimination_count }}
                  <small class="weak">({{ (playerShift.player_boss_elimination_count / playerShift.team_boss_elimination_count) | percentage }})</small>
                </p>
                <!--
                <span class="bar-container">
                  <proportional-bar-chart chart-key="boss-kill"
                    :fill-remainder="true"
                    :value="playerShift.player_boss_elimination_count"
                    :max="playerShift.team_boss_elimination_count" />
                </span>
                -->
              </div>

              <span class="leading">Golden eggs</span>
              <div>
                <p class="golden-egg">
                  {{ playerShift.player_golden_eggs }}
                  /
                  {{ playerShift.team_golden_eggs }}
                  <small class="weak">({{ (playerShift.player_golden_eggs / playerShift.team_golden_eggs) | percentage }})</small>
                </p>
                <!--
                <span class="bar-container">
                  <proportional-bar-chart chart-key="golden-egg"
                    :fill-remainder="true"
                    :value="playerShift.player_golden_eggs"
                    :max="playerShift.team_golden_eggs" />
                </span>
                -->
              </div>
              <span class="leading">Power eggs</span>
              <div>
                <p class="power-egg">
                  {{ playerShift.player_power_eggs }}
                  /
                  {{ playerShift.team_power_eggs }}
                  <small class="weak">({{ (playerShift.player_power_eggs / playerShift.team_power_eggs) | percentage }})</small>
                </p>
                <!--
                <span class="bar-container">
                  <proportional-bar-chart chart-key="power-egg"
                    :fill-remainder="true"
                    :value="playerShift.player_power_eggs"
                    :max="playerShift.team_power_eggs" />
                </span>
                -->
              </div>
            </div>
          </div>
        </div>
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

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

.summary {
  display: grid;
  grid-template-columns: auto 1fr;
  span.leading {
    text-align: right;
    justify-content: center;
    & + * {
      font-weight: normal;
      margin-left: 1em;
      color: $text-strong;
    }
  }
  .bar-container {
    display: block;
    max-width: 5em;
  }
}
</style>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import ScheduleCard from '@/components/ScheduleCard';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { formatScheduleId, parseRawSchedule, percentage, toFixed } from '@/helper';

@Component({
  name: 'PlayerShifts',
  components: { ProportionalBarChart, RequireFetchTemplate, ScheduleCard },
  filters: { percentage, toFixed },
})
export default class PlayerShifts extends RequireFetchBase {
  currentPage = 1;
  formatScheduleId = formatScheduleId;

  get apiPath() {
    return `players/${this.$route.params.playerId}/schedules?page=${this.$route.query.page || 1}`;
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
      name: 'players.schedules',
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
