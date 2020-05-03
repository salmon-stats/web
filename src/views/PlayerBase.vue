<template>
  <div>
    <player-page-header
      :title="title"
      :player-id="playerId"
      :is-loading-user-data="isLoadingUserData"
      :user-data="user"
    />
    <router-view class="body" />
  </div>
</template>

<style scoped>
.body {
  margin-top: 1em;
}
</style>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { playersModule } from '@/store/modules/players';
import PlayerPageHeader from '@/components/PlayerPageHeader.vue';

@Component({
  components: { PlayerPageHeader },
})
export default class PlayerBase extends Vue {
  isLoadingUserData = false;
  user = null;

  get title() {
    return {
      'players.schedules': 'Shifts',
      'players.schedules.summary': 'Shift summary',
      'players.schedules.results': 'Shift results',
      'players.summary': 'Overview',
      'players.results': 'Results',
      'players.results.latest': 'Latest result',
    }[this.$route.name];
  }
  get playerId() {
    return this.$route.params.playerId;
  }

  fetchUserData() {
    this.isLoadingUserData = true;

    if (playersModule.players.has(this.playerId)) {
      this.user = playersModule.players.get(this.playerId);

      if (!this.user.results) {
        // Make sure metadata with results will be fetched
        playersModule.players.delete(this.playerId);
      }
    } else {
      this.user = null;
    }

    playersModule
      .fetchPlayer(this.playerId)
      .then((responseBody) => (this.user = responseBody))
      .finally(() => (this.isLoadingUserData = false));
  }

  mounted() {
    this.fetchUserData();
  }

  @Watch('playerId')
  onChangePlayerId() {
    this.fetchUserData();
  }
}
</script>
