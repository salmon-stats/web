<template>
  <require-fetch-template>
    <div v-if="playerResults">
      <results :results-with-pagination="playerResults" :paginator="paginator" />
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Watch } from 'vue-property-decorator';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import Results from '@/components/Results.vue';
import { paginatorWithFilters } from '@/components/ResultsFilter.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { mapQueryParamsToApiPath } from '@/helper';

@Component({
  name: 'PlayerResults',
  components: { RequireFetchTemplate, Results },
})
export default class PlayerResults extends RequireFetchBase {
  get apiPath() {
    const path =
      `players/${this.playerId}` +
      (this.$route.params.scheduleId ? `/schedules/${this.$route.params.scheduleId}` : '') +
      '/results';

    return mapQueryParamsToApiPath(path, this.$route.query);
  }
  get playerId() {
    return this.$route.params.playerId;
  }
  get playerResults() {
    return state.data;
  }

  paginator(...args) {
    return paginatorWithFilters(this.$route, ...args);
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
