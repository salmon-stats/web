<template>
  <require-fetch-template>
    <div v-if="scheduleResults">
      <results
        :results-with-pagination="scheduleResults"
        :hide-schedule-heading="true"
        :paginator="paginator"
        :available-filters="fieldsWithout(['stages', 'weapons', 'player_results'])"
      />
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Watch } from 'vue-property-decorator';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import Results from '@/components/Results.vue';
import { fieldsWithout, paginatorWithFilters } from '@/components/ResultsFilter.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { mapQueryParamsToApiPath } from '@/helpers/helper';

@Component({
  name: 'ScheduleResults',
  components: { RequireFetchTemplate, Results },
  methods: { fieldsWithout },
})
export default class ScheduleResults extends RequireFetchBase {
  get scheduleId() {
    return this.$route.params.scheduleId;
  }
  get apiPath() {
    return mapQueryParamsToApiPath(`schedules/${this.scheduleId}/results`, this.$route.query);
  }
  get scheduleResults() {
    if (!state.data || !('results' in state.data)) {
      return;
    }

    return state.data.results;
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
