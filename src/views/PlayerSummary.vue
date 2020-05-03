<template>
  <require-fetch-template>
    <div class="columns">
      <div v-if="playerSummary" class="column is-9 player-summary">
        <results class="results" :raw-results="playerSummary.results" />
      </div>

      <div v-if="playerSummary" class="weapons column is-3">
        <h2>Weapons</h2>

        <div class="table-wrap is-fullwidth">
          <table class="is-fullwidth">
            <tbody>
              <tr
                @click="toResultsFilteredByWeapon(weapon.weapon_id)"
                class="clickable"
                v-show="i < 10 || isWeaponTableExpanded"
                v-for="(weapon, i) in playerSummary.weapons"
                :key="weapon.weapon_id"
              >
                <td>
                  <div class="weapon-image-container">
                    <main-weapon :weapon-id="weapon.weapon_id" />
                  </div>
                </td>
                <td class="is-fullwidth">
                  <p>
                    {{ weapon.count }}
                  </p>
                  <p class="proportional-bar-chart-container">
                    <proportional-bar-chart
                      :chart-key="isGrizzcoWeapon(weapon.weapon_id) ? 'golden-egg' : 'rescue'"
                      :value="weapon.count"
                      :max="playerSummary.weapons[0].count"
                    />
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="playerSummary.weapons.length > 10">
          <a @click="isWeaponTableExpanded = !isWeaponTableExpanded">{{
            isWeaponTableExpanded ? 'Collapse' : 'Expand'
          }}</a>
        </p>
      </div>
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Watch } from 'vue-property-decorator';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import Results from '@/components/Results.vue';
import MainWeapon from '@/components/MainWeapon.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { isGrizzcoWeapon } from '@/helper';

@Component({
  name: 'PlayerSummary',
  components: { ProportionalBarChart, RequireFetchTemplate, Results, MainWeapon },
  methods: { isGrizzcoWeapon },
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
  toResultsFilteredByWeapon(weaponId) {
    this.$router.push({
      name: 'players.results',
      query: { filters: JSON.stringify({ weapons: [weaponId] }) },
    });
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
