<template>
  <require-fetch-template>
    <div v-if="latestResults">
      <results :results-with-pagination="latestResults"
        :pagination-callback="paginate" />
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import PlayerPageHeader from '../components/PlayerPageHeader.vue';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import Results from '../components/Results.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';

@Component({
  name: 'latestResults',
  components: { PlayerPageHeader, RequireFetchTemplate, Results },
})
export default class latestResults extends RequireFetchBase {
  currentPage = 1;

  get apiPath() {
    return `results?page=${this.$route.query.page || 1}`;
  }
  get latestResults() {
    return state.data;
  }

  paginate(toPage) {
    this.$router.push({
      name: 'results',
      query: { page: toPage },
    });
  }
  mounted() {
    if (this.$route.query.page) {
      this.currentPage = parseInt(this.$route.query.page, 10);
    }

    state.fetch(this.apiPath);
  }

  @Watch('$route')
  onRouteChange() {
    state.fetch(this.apiPath);
  }
}
</script>
