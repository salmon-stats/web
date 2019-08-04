<template>
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
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import PlayerAvatar from '../components/PlayerAvatar.vue';

@Component({
  name: 'PlayerPageHeader',
  components: { PlayerAvatar },
  props: {
    playerId: String,
    user: Object,
  },
})
export default class PlayerPageHeader extends Vue {

}
</script>
