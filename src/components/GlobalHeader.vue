<template>
  <div>
    <router-link to="/">Home</router-link>
    <div v-if="user">
      <p>
        <span v-if="hasMyPage">
          <router-link :to="myPagePath">My results</router-link>
        </span>
        <span v-else>
          You have not uploaded results yet.
          <!-- Todo: add link to "How to upload" -->
        </span>
      </p>
      <div>
        {{ user.name }}
        <img :src="user.twitter_avatar">
      </div>
    </div>
    <div v-else>
      <a :href="signInUrl">Sign in with Twitter</a>
    </div>

    <div v-if="hasSessionExpired">
      Session has expired.
    </div>
  </div>
</template>

<style scoped>
img {
  width: 32px;
}
</style>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { metadataModule as metadata } from '../store/modules/metadata';

@Component({
  name: 'GlobalHeader',
})
export default class GlobalHeader extends Vue {
  signInUrl = VUE_APP_API_URL + '/auth/twitter';

  get user() {
    return metadata.user;
  }
  get hasSessionExpired() {
    return metadata.hasSessionExpired;
  }
  get hasMyPage() {
    return !!this.user.player_id;
  }
  get myPagePath() {
    return `/players/${this.user.player_id}`;
  }
}
</script>
