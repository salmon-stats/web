<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else>
      <div v-if="playerSummary">
        <div v-if="user">
          <h1><a :href="`https://twitter.com/${user.name}`">@{{ user.name }}</a></h1>
          <!-- <img :src="user.twitter_avatar"> -->
        </div>
        <div v-else>
          {{ playerId }} is not a registered user.
        </div>

        <table>
          <tr
            :class="[result.fail_reason_id ? 'fail' : 'clear' ]"
            @click="toResultPage(result.id)"
            v-for="result in playerSummary.results" :key="result.id">
            <td>{{ result.fail_reason_id ? 'Fail' : 'Clear'  }}</td>
            <td>{{ result.start_at }}</td>
            <td>{{ result.danger_rate }}</td>
            <!-- <td>{{ result.members.length }}</td> -->
          </tr>
        </table>
      </div>
      <div v-else>
        An error has occured during loading player summary for {{ playerId }}.
      </div>

      <div>
        <p><a :href="splatoonStatsUrl">Check {{ playerName }} on Splatoon Stats</a></p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.clear {
  td:nth-child(1) {
    color: greenyellow;
  }
}
.fail {
  td:nth-child(1) {
    color: orange;
  }
}
</style>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import apiClient from '../api-client';

@Component({
  name: 'PlayerSummary',
})
export default class PlayerSummary extends Vue {
  loading = false;
  playerSummary = null;

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

  mounted() {
    this.fetchPlayerSummary(this.playerId);
  }

  @Watch('playerId')
  onPlayerIdChange(newPlayerId) {
    this.fetchPlayerSummary(newPlayerId);
  }

  fetchPlayerSummary(playerId) {
    this.loading = true;
    apiClient.get(`/players/${playerId}`)
      .then((res) => {
        this.playerSummary = res.data;
      })
      .catch(() => {
        this.playerSummary = null;
      })
      .finally(() => {
        this.loading = false;
      });
  }
  toResultPage(resultId) {
    this.$router.push({ name: 'result', params: { resultId } });
  }
}
</script>
