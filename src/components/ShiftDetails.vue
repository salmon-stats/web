<template>
  <div class="summary">
    <div class="field">
      <b-switch v-model="isTeamView">
        Team
      </b-switch>
      <!-- <b-switch v-model="normalizeFailedGame">Normalize failed games</b-switch> -->
    </div>

    <h2>{{ playerName }}</h2>
    <h2>Global</h2>

    <span class="leading">Cleared games</span>
    <div>
      <p>
        {{ shiftSummaries[0].clear_games }} / {{ shiftSummaries[0].games }}
        <small class="weak">({{ (shiftSummaries[0].clear_games / shiftSummaries[0].games) | percentage }})</small>
      </p>
      <span class="bar-container">
        <proportional-bar-chart
          chart-key="win-loss"
          :fill-remainder="true"
          :value="shiftSummaries[0].clear_games"
          :max="shiftSummaries[0].games"
        />
      </span>
    </div>
    <div>
      <p>
        {{ shiftSummaries[1].clear_games }} / {{ shiftSummaries[1].games }}
        <small class="weak">({{ (shiftSummaries[1].clear_games / shiftSummaries[1].games) | percentage }})</small>
      </p>
      <span class="bar-container">
        <proportional-bar-chart
          chart-key="win-loss"
          :fill-remainder="true"
          :value="shiftSummaries[1].clear_games"
          :max="shiftSummaries[1].games"
        />
      </span>
    </div>

    <span class="leading">Avg. waves</span>
    <div>
      <p>
        {{ (shiftSummaries[0].clear_waves / shiftSummaries[0].games) | toFixed(2) }}
      </p>
      <span class="bar-container">
        <proportional-bar-chart
          chart-key="win-loss"
          :fill-remainder="true"
          :value="shiftSummaries[0].clear_waves"
          :max="shiftSummaries[0].games * 3"
        />
      </span>
    </div>
    <div>
      <p>
        {{ (shiftSummaries[1].clear_waves / shiftSummaries[1].games) | toFixed(2) }}
      </p>
      <span class="bar-container">
        <proportional-bar-chart
          chart-key="win-loss"
          :fill-remainder="true"
          :value="shiftSummaries[1].clear_waves"
          :max="shiftSummaries[1].games * 3"
        />
      </span>
    </div>

    <span class="leading">Rescue</span>
    <p v-if="isTeamView">
      {{ (shiftSummaries[0].team_rescue * normalizationMultiplier(0)) | toFixed(2) }}
      <!-- <small class="weak">({{ shiftSummaries[0].team_rescue * normalizationMultiplier(0) | toFixed(2) }})</small> -->
    </p>
    <p v-else>
      {{ (shiftSummaries[0].rescue * normalizationMultiplier(0)) | toFixed(2) }}
      <!-- <small class="weak">({{ shiftSummaries[0].rescue * normalizationMultiplier(0) | toFixed(2) }})</small> -->
    </p>
    <p>
      {{ (shiftSummaries[1].rescue * normalizationMultiplier(1)) | toFixed(2) }}
      <!-- <small class="weak">({{ shiftSummaries[1].rescue * normalizationMultiplier(1) | toFixed(2) }})</small> -->
    </p>

    <span class="leading">Death</span>
    <p v-if="isTeamView">
      -
    </p>
    <p v-else>
      {{ (shiftSummaries[0].death * normalizationMultiplier(0)) | toFixed(2) }}
      <!-- <small class="weak">({{ shiftSummaries[0].team_death * normalizationMultiplier(0) | toFixed(2) }})</small> -->
    </p>
    <p>
      -
    </p>

    <span class="leading">Boss elimination</span>
    <p v-if="isTeamView">
      {{
        (shiftSummaries[0].boss_elimination_count / shiftSummaries[0].boss_appearance_count / teamMultiplier(0))
          | percentage
      }}
      <small class="weak">({{ (shiftSummaries[0].boss_elimination_count * normalizationMultiplier(0)) | toFixed(1) }})</small>
    </p>
    <p v-else>
      {{
        (shiftSummaries[0].player_boss_elimination_count /
          shiftSummaries[0].team_boss_elimination_count /
          teamMultiplier(0))
          | percentage
      }}
      <small class="weak">({{ (shiftSummaries[0].player_boss_elimination_count * normalizationMultiplier(0)) | toFixed(1) }})</small>
    </p>
    <p>
      {{
        (shiftSummaries[1].boss_elimination_count / shiftSummaries[1].boss_appearance_count / teamMultiplier(1))
          | percentage
      }}
      <small class="weak">({{ (shiftSummaries[1].boss_elimination_count * normalizationMultiplier(1)) | toFixed(1) }})</small>
    </p>

    <span class="leading">Golden eggs</span>
    <p class="golden-egg">
      {{ (shiftSummaries[0][`${keyPrefix}golden_eggs`] * normalizationMultiplier(0, true)) | toFixed(2) }}
    </p>
    <p class="golden-egg">
      {{ (shiftSummaries[1].golden_eggs * normalizationMultiplier(1)) | toFixed(2) }}
    </p>

    <span class="leading">Power eggs</span>
    <p class="power-egg">
      {{ (shiftSummaries[0][`${keyPrefix}power_eggs`] * normalizationMultiplier(0)) | toFixed(0) }}
    </p>
    <p class="power-egg">
      {{ (shiftSummaries[1].power_eggs * normalizationMultiplier(1)) | toFixed(0) }}
    </p>

    <template v-for="bossId in bossIds">
      <span class="leading" :key="`${bossId}-leading`">
        {{ $t(getTranslationKey('boss', bossId)) }}
      </span>
      <div :key="`${bossId}-player`">
        <p v-if="shiftSummaries[0][`boss_appearance_${bossId}`]">
          {{
            (shiftSummaries[0][`${keyPrefix}boss_elimination_${bossId}`] /
              shiftSummaries[0][`boss_appearance_${bossId}`] /
              teamMultiplier(0))
              | percentage(1)
          }}
        </p>
        <p v-else>
          -
        </p>
      </div>

      <div :key="`${bossId}-global`">
        <p v-if="shiftSummaries[1][`boss_appearance_${bossId}`]">
          {{
            (shiftSummaries[1][`boss_elimination_${bossId}`] /
              shiftSummaries[1][`boss_appearance_${bossId}`] /
              teamMultiplier(1))
              | percentage(1)
          }}
        </p>
        <p v-else>
          -
        </p>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

.summary {
  display: grid;
  grid-template-columns: auto 1fr 1fr;

  span.leading {
    text-align: right;
    justify-content: center;
    & + *,
    & + * + * {
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

h2 {
  margin-left: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import ScheduleCard from '@/components/ScheduleCard.vue';
import { idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';
import { getTranslationKey, percentage, toFixed } from '@/helpers/helper';

@Component({
  name: 'ShiftDetails',
  components: { ProportionalBarChart, ScheduleCard },
  filters: { percentage, toFixed },
  props: {
    normalizeFailedGame: Boolean,
    playerName: String,
    shiftSummaries: Array,
  },
  methods: { getTranslationKey },
})
export default class ShiftDetails extends Vue {
  isTeamView = false;

  get bossIds() {
    return idKeyMap.bossIds;
  }
  get keyPrefix() {
    return this.isTeamView ? 'team_' : 'player_';
  }
  wavesPlayed(i) {
    return this.shiftSummaries[i].clear_waves + (this.shiftSummaries[i].games - this.shiftSummaries[i].clear_games);
  }
  teamMultiplier(i) {
    return !this.isTeamView && this.shiftSummaries[i].isGlobal ? 4 : 1;
  }
  normalizationMultiplier(i) {
    if (this.normalizeFailedGame) {
      return 3 / this.wavesPlayed(i) / this.teamMultiplier(i);
    }

    return 1 / this.shiftSummaries[i].games / this.teamMultiplier(i);
  }
}
</script>
