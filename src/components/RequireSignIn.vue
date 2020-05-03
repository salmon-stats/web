<template>
  <div>
    <div v-if="isSignedIn">
      <slot />
    </div>
    <div v-else>You are required to sign in {{ message }}.</div>
  </div>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator';
import { metadataModule } from '../store/modules/metadata';

@Component({
  name: 'RequireSignIn',
  props: {
    message: String,
  },
})
export default class RequireSignIn extends Vue {
  hasCalledOnAuthenticated = false;

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
