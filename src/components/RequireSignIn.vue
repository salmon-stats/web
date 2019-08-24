<template>
  <div>
    <div v-if="isSignedIn">
      <slot></slot>
    </div>
    <div v-else>
      You are required to sign in {{ message }}.
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { metadataModule } from '../store/modules/metadata';

@Component({
  name: 'RequireSignIn',
  props: {
    message: String,
  }
})
export default class RequireSignIn extends Vue {
  get isSignedIn() {
    return !!metadataModule.user;
  }

  @Watch('isSignedIn')
  onSignInChange() {
    if (this.isSignedIn && this.onAuthenticated) {
      this.$nextTick(() => {
        this.onAuthenticated();
      });
    }
  }
}
</script>
