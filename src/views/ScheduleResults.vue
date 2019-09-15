<template>
  <require-fetch-template>
    <div v-if="scheduleResults">
      <results :results-with-pagination="scheduleResults"
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
  name: 'ScheduleResults',
  components: { RequireFetchTemplate, Results },
})
export default class ScheduleResults extends RequireFetchBase {
  get scheduleId() {
    return this.$route.params.scheduleId;
  }
  get apiPath() {
    return `schedules/${this.scheduleId}/results?page=${this.$route.query.page || 1}`;
  }
  get scheduleResults() {
    if (!state.data || !('results' in state.data)) return;

    return state.data.results;
  }

  paginator(toPage) {
    return {
      name: 'schedules.results',
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
