<template>
  <div>
    <player-page-header :title="title" :player-id="playerId"
      :is-loading-user-data="isLoadingUserData" :user-data="user" />
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
import PlayerPageHeader from '../components/PlayerPageHeader.vue';


@Component({
  components: { PlayerPageHeader },
})
export default class PlayerBase extends Vue {
  isLoadingUserData = false;
  user = null;

  get title() {
    return {
      'players.summary': 'Overview',
      'players.results': 'Results',
    }[this.$route.name];
  }
  get playerId() {
    return this.$route.params.playerId;
  }

  mounted() {
    this.isLoadingUserData = true;

    playersModule.fetchPlayer(this.playerId)
      .then((responseBody) => this.user = responseBody)
      .finally(() => this.isLoadingUserData = false);
  }
}
</script>
