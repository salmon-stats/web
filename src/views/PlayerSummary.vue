<template>
  <require-fetch-template>
    <div class="columns">
      <div v-if="playerSummary" class="column is-8 player-summary">
        <results class="results" :raw-results="playerSummary.results" />
      </div>

      <div v-if="playerSummary" class="weapons column is-4">
        <h2>Weapons</h2>

        <div class="table-wrap is-fullwidth">
          <table class="is-fullwidth">
            <tbody>
              <tr v-show="i < 10 || isWeaponTableExpanded" v-for="(weapon, i) in playerSummary.weapons" :key="weapon.weapon_id">
                <td>
                  <div class="weapon-image-container">
                    <weapon-image :id="weapon.weapon_id" />
                  </div>
                </td>
                <td class="is-fullwidth">
                  <p>
                    {{ weapon.count }}
                  </p>
                  <p class="proportional-bar-chart-container">
                    <proportional-bar-chart
                      chart-key="rescue"
                      :value="weapon.count"
                      :max="playerSummary.weapons[0].count"
                    />
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="playerSummary.weapons.length > 10"><a @click="isWeaponTableExpanded = !isWeaponTableExpanded">{{ isWeaponTableExpanded ? 'Collapse' : 'Expand' }}</a></p>
      </div>
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import ProportionalBarChart from '@/components/ProportionalBarChart';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import Results from '@/components/Results.vue';
import WeaponImage from '@/components/WeaponImage.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { playersModule } from '@/store/modules/players';

@Component({
  name: 'PlayerSummary',
  components: { ProportionalBarChart, RequireFetchTemplate, Results, WeaponImage }
})
export default class PlayerSummary extends RequireFetchBase {
  isWeaponTableExpanded = false;

  get apiPath() {
    return `players/${this.playerId}`;
  }
  get playerId() {
    return this.$route.params.playerId;
  }
  get playerSummary() {
    return state.data;
  }

  toResultPage(resultId) {
    this.$router.push({ name: 'results.summary', params: { resultId } });
  }
  mounted() {
    state.fetch(this.apiPath);
  }

  @Watch('$route')
  onRouteChange() {
    this.isWeaponTableExpanded = false;
    state.fetch(this.apiPath);
  }
}
</script>
