<template>
  <div class="header">
    <div class="user">
      <router-link class="is-marginless columns" tag="div" :to="`/players/${playerId}`">
        <template v-if="!user || isLoadingUserData" class="is-marginless columns">
          <div class="avatar">
            <div v-if="isLoadingUserData" class="avatar-placeholder" />
            <player-avatar v-else class="avatar"
              :size="72" :blockies-seed="playerId" />
          </div>
          <div>
            <h1>
              <a>{{ playerId }}</a>
            </h1>
            <p>{{ title }}</p>
          </div>
        </template>
        <template v-else>
          <player-avatar class="avatar"
            :size="72" :user="user" :blockies-seed="playerId" />
          <div>
            <h1>
              <a>{{ user.isRegistered ? `@${user.name}` : user.name }}</a>
            </h1>
            <p>{{ title }}</p>
          </div>
        </template>
      </router-link>
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

.avatar+div {
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

.avatar .avatar-placeholder {
  width: 72px;
  height: 72px;
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import PlayerAvatar from '@/components/PlayerAvatar.vue';

@Component({
  name: 'PlayerPageHeader',
  components: { PlayerAvatar },
  props: {
    isLoadingUserData: Boolean,
    playerId: String,
    title: String,
    userData: Object,
  },
})
export default class PlayerPageHeader extends Vue {
  user = null;

  get twitterProfileUrl() {
    if (!this.user || !this.user.twitterName) return null;

    return `https://twitter.com/${this.user.twitterName}`;
  }
  get splatoonStatsUrl() {
    return SPLATOON_STATS_URL + `/players/${this.playerId}`;
  }

  @Watch('userData')
  onUserDataChange() {
    this.user = this.userData;
  }
}
</script>
