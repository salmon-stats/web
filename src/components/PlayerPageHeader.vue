<template>
  <div class="header is-clipped">
    <div class="is-marginless columns user is-clipped">
      <router-link class="is-flex" tag="div" :to="`/players/${playerId}`">
        <template v-if="user" class="is-marginless is-flex">
          <player-avatar class="avatar"
            :size="72" :user="user" :blockies-seed="playerId" :key="playerId" />
          <div>
            <h1>
              <a>
                {{ user.isRegistered ? `@${user.name}` : user.name }}
              </a>
            </h1>
            <p>{{ title }}</p>
          </div>
        </template>
        <template v-else>
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
      </router-link>

      <div  class="is-flex lifetime-stats">
        <template v-if="user && user.results">
          <div>
            <p>Results</p>
            <p>
              <span class="clear">{{user.results.clear}}</span>
              -
              <span class="fail">{{user.results.fail}}</span>
            </p>
          </div>
          <div class="is-hidden-mobile">
            <p>Clear rate</p>
            <p>{{percentage(user.results.clear/totalGames)}}</p>
          </div>
          <div>
            <p title="Rescue/Death">R/D</p>
            <p class="is-hidden-mobile">
              {{user.total.rescue}}/{{user.total.death}}
            </p>
            <p class="is-hidden-tablet">
              {{user.total.rescue / (user.total.death === 0 ? 1 : user.total.death) | toFixed(2)}}
            </p>
          </div>
          <div>
            <p>Total eggs</p>
            <p class="is-hidden-mobile">
              <span class="golden-egg" :title="user.total.golden_eggs">{{useMetricPrefix(user.total.golden_eggs, 2)}}</span>
              -
              <span class="power-egg" :title="user.total.power_eggs">{{useMetricPrefix(user.total.power_eggs, 2)}}</span>
            </p>
            <p class="is-hidden-tablet">
              <span class="golden-egg">{{useMetricPrefix(user.total.golden_eggs, 2)}}</span>
              -
              <span class="power-egg">{{useMetricPrefix(user.total.power_eggs, 2)}}</span>
            </p>
          </div>
          <div>
            <p>Avg boss</p>
            <p>
              <span :title="user.total.boss_elimination_count">
                {{user.total.boss_elimination_count / totalGames | toFixed(2)}}
              </span>
            </p>
          </div>
        </template>
        <div v-else-if="isLoadingUserData" class="placeholder" />
      </div>
    </div>

    <div class="navigation is-flex">
      <router-link :exact="true" :to="playerSummary">
        Overview
      </router-link>
      <router-link :exact="true" :class="$route.name === 'players.results' && 'router-link-active'" :to="`/players/${playerId}/results`">
        Results
      </router-link>
      <router-link :exact="true" :to="`/players/${playerId}/schedules`">
        Shifts
      </router-link>
      <router-link :exact="true" :to="`/players/${playerId}/results/latest`">
        Latest Result
      </router-link>
      <a v-if="twitterProfileUrl" class="external twitter" :href="twitterProfileUrl">
        Twitter
      </a>
      <a class="external splatoon-stats" :href="splatoonStatsUrl">
        Splatoon Stats
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/bulma-variables.scss';

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
    color: $text-strong !important;
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

    p:not(:first-child) {
      color: $text-strong;
      justify-self: end;
      text-align: right;
    }
  }
}

.navigation {
  background-color: darken($background, 10%);
  overflow-x: auto;

  a {
    padding: .5em;
    white-space: nowrap;

    &.external {
      &.twitter { color: $twitter-color; }
      &.twitter:hover { color: lighten($twitter-color, 10%); }
      &.splatoon-stats { color: $link; }
      &.splatoon-stats:hover { color: lighten($link, 10%); }
    }

    &:hover,
    &.router-link-active {
      background-color: darken($background, 5%);
      color: $text-strong;
    }
    &:not(.router-link-active) {
      color: $body-color;
      &:hover { color: $text-strong; }
    }
    // &:not(:first-child) { margin-left: 1em; }
  }
}
</style>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import PlayerAvatar from '@/components/PlayerAvatar.vue';
import { percentage, toFixed, useMetricPrefix } from '@/helper';

@Component({
  name: 'PlayerPageHeader',
  components: { PlayerAvatar },
  filters: {
    toFixed,
  },
  props: {
    isLoadingUserData: Boolean,
    playerId: String,
    title: String,
    userData: Object,
  },
})
export default class PlayerPageHeader extends Vue {
  percentage = percentage;
  useMetricPrefix = useMetricPrefix;
  user = null;

  get totalGames() {
    return this.user.results.clear + this.user.results.fail;
  }
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
