<template>
  <require-fetch-template>
    <div v-if="playerSummary">
      <player-page-header :player-id="playerId" :user="user" />

      <div>
        <router-link :to="`/players/${playerId}/results`">Results</router-link>
      </div>

      <results :raw-results="playerSummary.results" />
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
import Results from '../components/Results.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';

@Component({
  name: 'PlayerSummary',
  components: { PlayerPageHeader, RequireFetchTemplate, Results },
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
