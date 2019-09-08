<template>
  <div class="header">
    <div class="user">
      <div class="is-marginless columns">
        <player-avatar :size="72" :user="user" :blockies-seed="playerId" />
        <router-link class="player-header-title" tag="div" :to="`/players/${playerId}`">
          <h1 v-if="user">
            <a>@{{user.name}}</a>
          </h1>
          <h1 v-else>
            <a>{{playerId}}</a>
          </h1>

          <p>{{ title }}</p>
        </router-link>
      </div>
    </div>

    <div class="navigation is-marginless columns">
      <div>
        <router-link :exact="true" :to="`/players/${playerId}`">Overview</router-link>
        <router-link :to="`/players/${playerId}/results`">Results</router-link>
      </div>
      <div>
        <a v-if="twitterProfileUrl" class="splatoon-stats-link" :href="twitterProfileUrl">Twitter</a>
        <a class="splatoon-stats-link" :href="splatoonStatsUrl">Splatoon Stats</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.player-header-title {
  margin-left: .5em;
}

h1 {
  font-size: 200%;
  // align-self: flex-end;
  a {
    color: $body-accent-color;
  }
}

.header {
  margin-bottom: 1em;
  width: 100%;
  background-color: darken($background, 10%);
  justify-content: space-between;
  > div {
    width: 100%;
  }
}

.user {
  padding: .5em;
  > div {
    width: fit-content
  }
}

.navigation {
  background-color: darken($background, 10%);
  justify-content: space-between;

  > div {
    display: flex;
  }

  a {
    padding: .5em;

    &:hover,
    &.router-link-active {
      background-color: darken($background, 5%);
      color: $body-accent-color;
    }
    &:not(.router-link-active) {
      color: $body-color;
      &:hover { color: $body-accent-color; }
    }
    // &:not(:first-child) { margin-left: 1em; }
  }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import PlayerAvatar from '@/components/PlayerAvatar.vue';

@Component({
  name: 'PlayerPageHeader',
  components: { PlayerAvatar },
  props: {
    playerId: String,
    user: Object,
    title: String,
  },
})
export default class PlayerPageHeader extends Vue {
  get twitterProfileUrl() {
    if (!this.user || !this.user.name) return null;

    return `https://twitter.com/${this.user.name}`;
  }
  get splatoonStatsUrl() {
    return SPLATOON_STATS_URL + `/players/${this.playerId}`;
  }
}
</script>
