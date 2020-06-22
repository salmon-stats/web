<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/" active-class="" exact>
        Salmon Stats
      </router-link>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        @click="toggleBurgerMenu"
        :class="isBurgerMenuOpen ? 'is-active' : ''"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>

      <div class="is-hidden-desktop my-profile">
        <template v-if="hasMyPage">
          <account-switcher v-if="hasMyPage" :user="user" />
        </template>
      </div>
    </div>
    <div class="navbar-menu" :class="isBurgerMenuOpen ? 'is-active' : ''">
      <div class="navbar-start">
        <div class="use-marker navbar-item">
          <router-link to="/results" :class="$route.name === 'results' && 'router-link-active'" exact>
            Results
          </router-link>
        </div>
        <div class="use-marker navbar-item">
          <router-link to="/schedules" :class="$route.name === 'schedules' && 'router-link-active'" exact>
            Schedules
          </router-link>
        </div>
        <div class="use-marker navbar-item">
          <router-link to="/players/search" :class="$route.name === 'players.search' && 'router-link-active'" exact>
            Search
          </router-link>
        </div>
        <div class="is-hidden-desktop use-marker navbar-item">
          <router-link to="/settings" :class="$route.name === 'settings' && 'router-link-active'" exact>
            Settings
          </router-link>
        </div>
      </div>
      <div class="navbar-end">
        <template v-if="user">
          <div class="use-marker navbar-item is-hidden-touch">
            <router-link to="/settings">
              Settings
            </router-link>
          </div>

          <div class="navbar-item my-profile is-hidden-touch">
            <account-switcher v-if="hasMyPage" :user="user" />
          </div>
        </template>
        <template v-else>
          <div class="navbar-item">
            <a :href="signInUrl">Sign in</a>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

a {
  font-weight: bold;
}

.navbar-item a {
  padding: 0 0.25rem;
}
.use-marker a {
  color: inherit;
  background-size: 0%;
  background-image: linear-gradient(transparent 60%, #f33 60% 90%, transparent 90%);
  background-repeat: no-repeat;
  text-shadow: 1px 1.5px 0px hsl(0, 0%, 0%);
  &.router-link-active {
    background-size: 100%;
  }
  &:hover {
    background-size: 100%;
    transition: background-size 0.2s;
  }
}
.my-profile {
  display: flex;
  align-items: center;

  margin: 0 0.5em;

  a {
    display: flex;
    align-items: center;
  }
}
</style>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { metadataModule as metadata } from '../store/modules/metadata';
import { mapGetters } from 'vuex';
import AccountSwitcher from '@/components/AccountSwitcher.vue';
import { signIn as signInUrl } from '@/urls';

@Component({
  components: { AccountSwitcher },
  name: 'GlobalHeader',
  computed: mapGetters('metadata', ['myPlayerId']),
})
export default class GlobalHeader extends Vue {
  isBurgerMenuOpen = false;

  signInUrl = signInUrl;

  get user() {
    return metadata.user;
  }
  get hasMyPage() {
    return this.user && this.myPlayerId;
  }

  toggleBurgerMenu() {
    this.isBurgerMenuOpen = !this.isBurgerMenuOpen;
  }
}
</script>
