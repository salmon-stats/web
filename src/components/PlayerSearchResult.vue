<template>
  <router-link :to="`/players/${player.player_id}`">
    <div class="box">
      <div class="user">
        <img v-if="player.twitter_avatar" :src="player.twitter_avatar">
        <p class="name"><strong>{{ player.name }}</strong></p>
      </div>
      <p><span class="weak">{{ player.updated_at }}</span></p>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.user {
  display: flex;

  img {
    width: 32px;
    height: 32px;

    &+.name {
      margin-left: .5em;
      align-self: center;
    }
  }

  .name {
    flex-grow: 1;
  }
}
</style>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'PlayerSearchResult',
  props: { player: Object },
})
export default class PlayerSearchResult extends Vue {
}
</script>
