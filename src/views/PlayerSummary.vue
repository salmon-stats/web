<template>
  <require-fetch-template>
    <div class="columns">
      <div v-if="playerSummary" class="column is-8-desktop player-summary">
        <results class="results" :raw-results="playerSummary.results" />
      </div>
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import Results from '../components/Results.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { playersModule } from '@/store/modules/players';

@Component({
  name: 'PlayerSummary',
  components: { RequireFetchTemplate, Results },
})
export default class PlayerSummary extends RequireFetchBase {
  get apiPath() {
    return `players/${this.$route.params.playerId}`;
  }
  get playerId() {
    return this.$route.params.playerId;
  }
  get playerSummary() {
    return state.data;
  }

  toResultPage(resultId) {
    this.$router.push({ name: 'results.summary', params: { resultId } });
  }
  mounted() {
    state.fetch(this.apiPath);
  }

  @Watch('$route')
  onRouteChange() {
    state.fetch(this.apiPath);
  }
}
</script>
