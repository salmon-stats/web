<template>
  <require-fetch-template>
    <div v-if="playerSummary">
      <div v-if="user">
        <h1><a :href="`https://twitter.com/${user.name}`">
          <player-avatar :size="48" :user="user">
            @{{ user.name }}
          </player-avatar>
        </a></h1>
      </div>
      <div v-else>
        <h1>
          <player-avatar :size="48" :blockiesSeed="playerId">
            {{ playerId }}
          </player-avatar>
        </h1>
        <p>{{ playerId }} is not a registered user.</p>
      </div>

      <div>
        <router-link :to="`/players/${playerId}/peers`">Peers</router-link>
      </div>

      <div class="table-wrap">
        <table class="is-hoverable">
          <tbody>
            <tr class="clickable"
              :class="[result.fail_reason_id ? 'fail' : 'clear' ]"
              @click="toResultPage(result.id)"
              v-for="result in playerSummary.results" :key="result.id">
              <td>{{ result.fail_reason_id ? 'Fail' : 'Clear'  }}</td>
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
import PlayerAvatar from '../components/PlayerAvatar.vue';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';

@Component({
  name: 'PlayerSummary',
  components: { PlayerAvatar, RequireFetchTemplate },
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
