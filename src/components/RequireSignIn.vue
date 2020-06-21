<template>
  <div>
    <div v-if="isSignedIn">
      <slot />
    </div>
    <div v-else>
      <p>You are required to sign in {{ message }}.</p>

      <div class="buttons is-centered">
        <a class="button" :href="signInUrl">Sign in</a>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator';

import { metadataModule } from '@/store/modules/metadata';
import { signIn as signInUrl } from '@/urls';

@Component({
  name: 'RequireSignIn',
  props: {
    message: String,
  },
})
export default class RequireSignIn extends Vue {
  hasCalledOnAuthenticated = false;

  signInUrl = signInUrl;

  get isSignedIn() {
    return !!metadataModule.user;
  }

  get shouldFireAuthenticated() {
    return this.isSignedIn && this.onAuthenticated && !this.hasCalledOnAuthenticated;
  }

  fireOnAuthenticated() {
    this.hasCalledOnAuthenticated = true;
    this.onAuthenticated();
  }

  mounted() {
    if (this.shouldFireAuthenticated) {
      this.fireOnAuthenticated();
    }
  }

  @Watch('isSignedIn')
  onSignInChange() {
    if (this.shouldFireAuthenticated) {
      this.$nextTick(this.fireOnAuthenticated);
    }
  }
}
</script>
