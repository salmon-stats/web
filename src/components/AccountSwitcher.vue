<script lang="tsx">
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

  render(h) {
    const { $props: props } = this;

    const trigger = (
      <router-link to={`/players/${this.accounts[0].player_id}`}>
        <player-avatar style="vertical-align: middle;" size={32} show-tooltip={false} user={props.user} />
      </router-link>
    );

    return this.hasMultipleAccounts
      ? (
        <b-dropdown hoverable position="is-bottom-left">
          <span slot="trigger">{trigger}</span>
          {
            this.accounts.map((account) => (
              <b-dropdown-item key={account.player_id} class="dropdown-item">
                <router-link class="my" to={`/players/${account.player_id}`}>
                  {account.name.name}
                </router-link>
              </b-dropdown-item>
            ))
          }
        </b-dropdown>
      )
      : trigger;
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
