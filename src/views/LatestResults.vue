<template>
  <require-fetch-template>
    <div v-if="latestResults">
      <results
        :results-with-pagination="latestResults"
        :is-in-start-date-order="false"
        :paginator="paginator"
        :available-filters="fieldsWithout(['weapons', 'player_results'])"
      />
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Watch } from 'vue-property-decorator';
import { mapQueryParamsToApiPath } from '@/helpers/helper';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import Results from '@/components/Results.vue';
import { paginatorWithFilters } from '@/components/ResultsFilter.vue';
import { fieldsWithout } from '@/components/ResultsFilter.vue';

@Component({
  name: 'LatestResults',
  components: { RequireFetchTemplate, Results },
  methods: { fieldsWithout },
})
export default class LatestResults extends RequireFetchBase {
  get apiPath() {
    return mapQueryParamsToApiPath('results', this.$route.query);
  }
  get latestResults() {
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
