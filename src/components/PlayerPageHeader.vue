<template>
  <div class="header">
    <div class="is-marginless columns user">
      <router-link class="is-flex" tag="div" :to="`/players/${playerId}`">
        <template v-if="!user || isLoadingUserData" class="is-marginless is-flex">
          <div class="avatar">
            <div v-if="isLoadingUserData" class="placeholder" />
            <player-avatar v-else class="avatar"
              :size="72" :blockies-seed="playerId" />
          </div>
          <div>
            <h1>
              <a>
                {{ playerId }}
              </a>
            </h1>
            <p>{{ title }}</p>
          </div>
        </template>
        <template v-else>
          <player-avatar class="avatar"
            :size="72" :user="user" :blockies-seed="playerId" />
          <div>
            <h1>
              <a>
                {{ user.isRegistered ? `@${user.name}` : user.name }}
              </a>
            </h1>
            <p>{{ title }}</p>
          </div>
        </template>
      </router-link>

      <div  class="is-flex lifetime-stats">
        <div v-if="isLoadingUserData" class="placeholder" />
        <template v-else>
          <div>
            <p>Results</p>
            <p>
              <span class="clear">{{user.results.clear}}</span>
              -
              <span class="fail">{{user.results.fail}}</span>
            </p>
          </div>
          <div>
            <p>Clear rate</p>
            <p>{{percentage(user.results.clear/(user.results.clear+user.results.fail))}}</p>
          </div>
          <div>
            <p title="Rescue/Death">R/D</p>
            <p>
              {{user.total.rescue}}/{{user.total.death}}
            </p>
          </div>
          <div>
            <p>Total eggs</p>
            <p>
              <span class="golden-egg">{{user.total.golden_eggs}}</span>
              -
              <span class="power-egg">{{user.total.power_eggs}}</span>
            </p>
          </div>
        </template>
      </div>
    </div>

    <div class="navigation is-flex">
      <div>
        <router-link :exact="true" :to="playerSummary">Overview</router-link>
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
@import '@/assets/bulma.scss';

.avatar {
  // height: 72px;
  & + div {
    margin-left: .5em;
  }
  > .placeholder {
    width: 72px;
    height: 72px;
  }
}

h1 {
  font-size: 200%;
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
  justify-content: space-between;
  > div {
    width: fit-content
  }
}


.lifetime-stats {
  align-items: flex-end;
  justify-content: flex-end;

  > .placeholder {
    height: 2 * $body-size * $body-line-height;
  }

  > div {
    &:not(:first-child) {
      margin-left: 1em;
    }

    p:last-child {
      color: $body-accent-color;
      justify-self: end;
      text-align: right;
    }
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import PlayerAvatar from '@/components/PlayerAvatar.vue';
import { percentage } from '@/helper';

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
  percentage = percentage;
  user = null;

  get twitterProfileUrl() {
    if (!this.user || !this.user.isRegistered) return null;

    return `https://twitter.com/${this.user.name}`;
  }
  get playerSummary() {
    return {
      name: 'players.summary',
      playerId: this.playerId,
    };
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
