<template>
  <require-fetch-template>
    <div v-if="playerSummary">
      <player-page-header :player-id="playerId" :user="user" />

      <div>
        <router-link :to="`/players/${playerId}/results`">Results</router-link>
      </div>

      <div class="table-wrap">
        <table class="is-hoverable">
          <tbody>
            <tr class="clickable" @click="toResultPage(result.id)"
              v-for="result in playerSummary.results" :key="result.id">
              <td :class="result.fail_reason_id ? 'fail' : 'clear'">
                {{ result.fail_reason_id ? 'Fail' : 'Clear' }}
              </td>
              <td>{{ result.start_at }}</td>
              <td>{{ result.danger_rate }}</td>
              <!-- <td>{{ result.members.length }}</td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <p><a :href="splatoonStatsUrl">Check {{ playerName }} on Splatoon Stats</a></p>
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import PlayerPageHeader from '../components/PlayerPageHeader.vue';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';

@Component({
  name: 'PlayerSummary',
  components: { PlayerPageHeader, RequireFetchTemplate },
})
export default class PlayerSummary extends RequireFetchBase {
  get apiPath() {
    return `players/${this.$route.params.playerId}`;
  }
  get playerId() {
    return this.$route.params.playerId;
  }
  get user() {
    return this.playerSummary && this.playerSummary.user ? this.playerSummary.user : null;
  }
  get playerName() {
    return this.user ? this.user.name : this.playerId;
  }
  get splatoonStatsUrl() {
    return SPLATOON_STATS_URL + `/players/${this.playerId}`;
  }
  get playerSummary() {
    return state.data;
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
}
</script>
