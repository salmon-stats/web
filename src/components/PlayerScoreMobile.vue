<template>
  <div class="box clickable player">
    <div class="player-name-row" @click="toPlayerSummary(p.player_id)">
      <div>
        <player-avatar :user="getAccountByPlayerId(p.player_id)" :size="32" :blockiesSeed="p.player_id" />
        <div class="name-container">
          <p class="player-name">
            {{ getPlayerName(p.player_id) }}
          </p>
          <p class="grade-point" v-if="p.grade_point && p.grade_point > 400">
            <span>{{ p.grade_point - 400 }}</span>
          </p>
        </div>
      </div>
      <div>
        <special-usage :special-id="p.special_id" :count="sum(p.special_uses.map((special) => special.count))" />
        <span class="weapon-icon main" v-for="(w, i) in p.weapons" :key="i">
          <main-weapon :weapon-id="w.weapon_id" />
        </span>
      </div>
    </div>
    <div class="data-row">
      <div class="columns is-gapless is-mobile stats">
        <div class="column">
          <span class="box large-image">
            <img src="@/assets/rescue.png" />
            <span :class="hasMost('rescue', p.rescue) ? 'has-most' : ''">
              <small>{{ p.rescue }}</small>
            </span>
          </span>
        </div>
        <div class="column">
          <span class="box large-image">
            <img src="@/assets/death.png" />
            <span :class="hasMost('death', p.death) ? 'has-most' : ''">
              <small>{{ p.death }}</small>
            </span>
          </span>
        </div>
        <div class="column">
          <span class="box small-image">
            <img src="@/assets/golden-egg.png" />
            <span class="golden-egg" :class="hasMost('golden_eggs', p.golden_eggs) ? 'has-most' : ''">
              <small>{{ p.golden_eggs }}</small>
            </span>
          </span>
        </div>
        <div class="column">
          <span class="box small-image">
            <img src="@/assets/power-egg.png" />
            <span class="power-egg" :class="hasMost('power_eggs', p.power_eggs) ? 'has-most' : ''">
              <small>{{ p.power_eggs }}</small>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

img {
  height: 16px;
  width: auto;
}

.box.player {
  padding: 0.75em;
}

.weapon-icon {
  display: inline-block;
  height: fit-content;
  background-color: darken($background, 15%);
  border-radius: 50%;
  height: 24px;
  margin-left: 0.25em;

  img {
    height: 24px;
    width: 24px;
  }
}

.player-name-row {
  display: flex;

  > div {
    display: flex;
    height: fit-content;
    align-items: center;
    align-content: center;
    overflow: hidden;

    &:first-child {
      flex: 1;
    }

    .grade-point,
    .player-name {
      margin-left: 0.5em;
    }
    .grade-point {
      font-size: 80%;
    }

    .name-container {
      overflow: hidden;
      p {
        &.player-name {
          color: $text-strong;
        }
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}

.data-row {
  margin-top: 0.75em;

  .stats {
    .column {
      &:not(:first-child) {
        margin-left: 0.5em;
      }

      .box {
        display: grid;
        padding: 0.25em;
        background-color: darken($background, 15%);

        &.large-image {
          grid-template-columns: 50px 1fr;
        }
        &.small-image {
          grid-template-columns: 24px 1fr;
        }

        img,
        span {
          display: inline-flex;
          // justify-content: flex-end;
          justify-self: center;
          align-self: center;
        }
        span {
          width: 100%;
        }
      }
    }
  }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';

import { sum } from '@/helper';

import MainWeapon from '@/components/MainWeapon.vue';
import PlayerAvatar from '@/components/PlayerAvatar.vue';
import SpecialUsage from '@/components/SpecialUsage.vue';

@Component({
  components: { MainWeapon, PlayerAvatar, SpecialUsage },
  name: 'PlayerScoreMobile',
  props: {
    getAccountByPlayerId: Function,
    getPlayerName: Function,
    hasMost: Function,
    player: Object,
  },
})
export default class PlayerScoreMobile extends Vue {
  sum = sum;

  get p() {
    return this.player;
  }

  toPlayerSummary(playerId) {
    this.$router.push({ name: 'players.summary', params: { playerId } });
  }
}
</script>
