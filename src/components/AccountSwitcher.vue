<template>
  <div>
    <b-dropdown
      hoverable
      position="is-bottom-left"
    >
      <router-link :to="`/players/${accounts[0].player_id}`" slot="trigger">
        <player-avatar style="vertical-align: middle;" :size="32" :user="user" />
      </router-link>
      <template v-if="hasMultipleAccounts">
        <b-dropdown-item v-for="account in accounts" :key="account.player_id" class="dropdown-item">
          <router-link class="my" :to="`/players/${account.player_id}`">
            {{ account.name.name }}
          </router-link>
        </b-dropdown-item>
      </template>
    </b-dropdown>
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

<style scoped>
::v-deep .dropdown-menu {
  min-width: 0;
}
::v-deep .dropdown-content {
  min-width: 5rem;
}
</style>
