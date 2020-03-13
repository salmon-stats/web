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
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import Results from '@/components/Results.vue';
import { mapQueryParamsToApiPath } from '@/helper';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';

const paginatorWithFilters = (route, page, filters) => {
  const toRoute = {
    name: route.name,
    query: {
      page,
    },
  };

  if (filters) {
    toRoute.query.filters = JSON.stringify(filters);
  } else if (filters !== null && route.query.filters) {
    // null filter means reset.
    toRoute.query.filters = route.query.filters;
  }

  return toRoute;
};

@Component({
  name: 'LatestResults',
  components: { RequireFetchTemplate, Results },
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
