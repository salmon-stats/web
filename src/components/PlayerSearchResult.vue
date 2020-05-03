<template>
  <router-link :to="`/players/${player.player_id}`">
    <div class="box">
      <div class="user">
        <player-avatar v-if="player.twitter_avatar" :user="player" />
        <p class="name">
          <strong>{{ player.name }}</strong>
        </p>
      </div>
      <p>
        <span class="weak">{{ player.updated_at }}</span>
      </p>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.user {
  display: flex;

  img {
    width: 32px;
    height: 32px;

    & + .name {
      margin-left: 0.5em;
      align-self: center;
    }
  }

  .name {
    flex-grow: 1;
  }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import PlayerAvatar from '@/components/PlayerAvatar.vue';

@Component({
  name: 'PlayerSearchResult',
  components: { PlayerAvatar },
  props: { player: Object },
})
export default class PlayerSearchResult extends Vue {}
</script>
