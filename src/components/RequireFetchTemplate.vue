<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else>
    <div v-if="error">
      {{ error.response.data.message ? error.response.data.message : error.message }}
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script>
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { Component, Vue } from 'vue-property-decorator';

export default class RequireFetchTemplate extends Vue {
  get error() {
    return state.error;
  }
  get isLoading() {
    return state.isLoading;
  }
}
</script>
