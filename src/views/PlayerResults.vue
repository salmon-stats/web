<template>
  <require-fetch-template>
    <div v-if="playerResults">
      <player-page-header :player-id="playerId" :user="user" />

      <div class="table-wrap">
        <table class="is-hoverable">
          <tbody>
            <tr class="clickable" @click="toResultPage(result.id)"
              v-for="result in playerResults.results.data" :key="result.id">
              <td :class="result.fail_reason_id ? 'fail' : 'clear'">
                {{ result.fail_reason_id ? 'Fail' : 'Clear' }}
              </td>
              <td>{{ result.start_at }}</td>
              <td>{{ result.danger_rate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <pagination :data="playerResults.results" @pagination-change-page="paginate">
        <span slot="prev-nav">&lt;</span>
        <span slot="next-nav">&gt;</span>
      </pagination>
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import PlayerPageHeader from '../components/PlayerPageHeader.vue';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import Pagination from 'laravel-vue-pagination';

@Component({
  name: 'PlayerSummary',
  components: { Pagination, PlayerPageHeader, RequireFetchTemplate },
})
export default class PlayerSummary extends RequireFetchBase {
  get apiPath() {
    return `players/${this.$route.params.playerId}/results?page=${this.$route.query.page}`;
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
      name: 'playerResults',
      params: { playerId: this.playerId },
      query: { page: toPage },
    });
  }
  toResultPage(resultId) {
    this.$router.push({ name: 'result', params: { resultId } });
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
