<template>
  <div class="columns is-tablet">
    <div class="column is-8 summary">
      <span class="leading">Cleared games</span>
      <div>
        <p>
          {{ shiftSummary.clear_games }} / {{ shiftSummary.games }}
          <small class="weak">({{ (shiftSummary.clear_games / shiftSummary.games) | percentage }})</small>
        </p>
        <span class="bar-container">
          <proportional-bar-chart
            chart-key="win-loss"
            :fill-remainder="true"
            :value="shiftSummary.clear_games"
            :max="shiftSummary.games"
          />
        </span>
      </div>

      <span class="leading">Avg. waves</span>
      <div>
        <p>
          {{ (shiftSummary.clear_waves / shiftSummary.games) | toFixed(2) }}
        </p>
        <span class="bar-container">
          <proportional-bar-chart
            chart-key="win-loss"
            :fill-remainder="true"
            :value="shiftSummary.clear_waves"
            :max="shiftSummary.games * 3"
          />
        </span>
      </div>

      <span class="leading">Rescue/Death</span>
      <div>
        <p>
          {{ shiftSummary.rescue }}
          /
          {{ shiftSummary.death }}
          <small class="weak">({{ (shiftSummary.rescue * normalizationMultiplier) | toFixed(2) }} /
            {{ (shiftSummary.death * normalizationMultiplier) | toFixed(2) }})</small>
        </p>
        <span class="bar-container">
          <proportional-bar-chart
            chart-key="rescue-death"
            :fill-remainder="true"
            :value="shiftSummary.rescue"
            :max="shiftSummary.rescue + shiftSummary.death"
          />
        </span>
      </div>

      <span class="leading">Boss elimination</span>
      <div>
        <p>
          {{ shiftSummary.player_boss_elimination_count }}
          /
          {{ shiftSummary.team_boss_elimination_count }}
          <small class="weak">({{
            (shiftSummary.player_boss_elimination_count / shiftSummary.team_boss_elimination_count) | percentage
          }})</small>
        </p>
      </div>

      <span class="leading">Golden eggs</span>
      <div>
        <p class="golden-egg">
          {{ shiftSummary.player_golden_eggs }}
          /
          {{ shiftSummary.team_golden_eggs }}
          <small class="weak">({{ (shiftSummary.player_golden_eggs / shiftSummary.team_golden_eggs) | percentage }})</small>
        </p>
      </div>

      <span class="leading">Power eggs</span>
      <div>
        <p class="power-egg">
          {{ shiftSummary.player_power_eggs }}
          /
          {{ shiftSummary.team_power_eggs }}
          <small class="weak">({{ (shiftSummary.player_power_eggs / shiftSummary.team_power_eggs) | percentage }})</small>
        </p>
      </div>
    </div>

    <div class="column is-4 is-hidden-mobile">
      <template v-for="({ count, games, special_id }) in shiftSummary.specials">
        <div :key="special_id">
          <weapon weapon-type="special" :weapon-id="special_id" />
          {{ games }} <small>({{ count }})</small>
        </div>
      </template>
    </div>
  </div>
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
      &:not([class]) {
        color: $text-strong;
      }
    }
  }
  .bar-container {
    display: block;
    max-width: 5em;
  }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import ScheduleCard from '@/components/ScheduleCard';
import Weapon from '@/components/Weapon.vue';
import { getTranslationKey, percentage, toFixed } from '@/helpers/helper';

@Component({
  name: 'ShiftSummary',
  components: { ProportionalBarChart, ScheduleCard, Weapon },
  filters: { percentage, toFixed },
  props: {
    shiftSummary: Object,
  },
})
export default class ShiftSummary extends Vue {
  getTranslationKey = getTranslationKey;

  get wavesPlayed() {
    return this.shiftSummary.clear_waves + (this.shiftSummary.games - this.shiftSummary.clear_games);
  }
  get normalizationMultiplier() {
    return 1 / this.shiftSummary.games;
  }
}
</script>
