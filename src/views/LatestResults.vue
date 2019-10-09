<template>
  <require-fetch-template>
    <div v-if="latestResults">
      <results :results-with-pagination="latestResults"
        :is-in-start-date-order="false"
        :paginator="paginator" />
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import Results from '../components/Results.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';

@Component({
  name: 'LatestResults',
  components: { RequireFetchTemplate, Results },
})
export default class LatestResults extends RequireFetchBase {
  get apiPath() {
    return `results?page=${this.$route.query.page || 1}`;
  }
  get latestResults() {
    return state.data;
  }

  paginator(toPage) {
    return {
      name: 'results',
      query: { page: toPage },
    };
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
