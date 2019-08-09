<template>
  <require-fetch-template>
    <div v-if="playerResults">
      <player-page-header :player-id="playerId" :user="user" />
      <div class="table-wrap">
        <table class="is-hoverable">
          <tbody>
            <tr class="clickable" @click="toResultPage(result.id)"
              v-for="result in playerResults.data" :key="result.id">
              <td :class="result.fail_reason_id ? 'fail' : 'clear'">
                {{ result.fail_reason_id ? 'Fail' : 'Clear' }}
              </td>
              <td>{{ result.start_at }}</td>
              <td>{{ result.danger_rate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <b-pagination
        :total="playerResults.total"
        :current.sync="currentPage"
        :per-page="playerResults.per_page"
        :range-before="3"
        :range-after="3"
        icon-pack="material-icons"
        @change="paginate"
      />
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import PlayerPageHeader from '../components/PlayerPageHeader.vue';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
// import Pagination from ;

@Component({
  name: 'PlayerResults',
  components: { PlayerPageHeader, RequireFetchTemplate },
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
      name: 'playerResults',
      params: { playerId: this.playerId },
      query: { page: toPage },
    });
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
