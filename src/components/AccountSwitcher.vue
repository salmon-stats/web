<template>
  <div class="dropdown is-right is-hoverable">
    <div class="dropdown-trigger">
      <router-link :to="`/players/${accounts[0].player_id}`">
        <player-avatar style="vertical-align: middle;" :size="32" :user="user" />
      </router-link>
    </div>
    <div v-if="hasMultipleAccounts" class="dropdown-menu">
      <div class="dropdown-content">
        <div v-for="account in accounts" :key="account.player_id" class="dropdown-item">
          <router-link class="my" :to="`/players/${account.player_id}`">
            {{ account.name.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Account, User } from '../types/salmon-stats';

import PlayerAvatar from '@/components/PlayerAvatar.vue';

@Component({
  components: { PlayerAvatar },
})
export default class AccountSwitcher extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  private user!: User;

  private get accounts(): Account[] {
    return this.user.accounts;
  }

  private get hasMultipleAccounts(): boolean {
    return this.accounts.length > 1;
  }
}
</script>
