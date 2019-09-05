<template>
  <require-fetch-template>
    <div v-if="playerResults">
      <player-page-header :player-id="playerId" :user="user" />
      <results :results-with-pagination="playerResults"
        :pagination-callback="paginate" />
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
// import Pagination from ;

@Component({
  name: 'PlayerResults',
  components: { PlayerPageHeader, RequireFetchTemplate, Results },
})
export default class PlayerResults extends RequireFetchBase {
  currentPage = 1;

  get apiPath() {
    return `players/${this.$route.params.playerId}/results?page=${this.$route.query.page || 1}`;
  }
  get playerId() {
    return this.$route.params.playerId;
  }
  get user() {
    return this.playerResults && this.playerResults.user ? this.playerResults.user : null;
  }
  get playerName() {
    return this.user ? this.user.name : this.playerId;
  }
  get playerResults() {
    return state.data;
  }

  paginate(toPage) {
    this.$router.push({
      name: 'players.results',
      params: { playerId: this.playerId },
      query: { page: toPage },
    });
  }
  mounted() {
    if (this.$route.query.page) {
      this.currentPage = parseInt(this.$route.query.page, 10);
    }

    state.fetch(this.apiPath);
  }

  @Watch('$route')
  onRouteChange() {
    this.currentPage = parseInt(this.$route.query.page || 1, 10);
    state.fetch(this.apiPath);
  }
}
</script>
