<template>
  <require-fetch-template>
    <div v-if="latestResults">
      <div class="table-wrap">
        <table class="is-hoverable">
          <tbody>
            <tr class="clickable" @click="toResultPage(result.id)"
              v-for="result in latestResults.data" :key="result.id">
              <td :class="result.fail_reason_id ? 'fail' : 'clear'">
                {{ result.fail_reason_id ? 'Fail' : 'Clear' }}
              </td>
              <td>{{ result.start_at }}</td>
              <td>{{ result.danger_rate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <b-pagination
        :total="latestResults.total"
        :current.sync="currentPage"
        :per-page="latestResults.per_page"
        :range-before="3"
        :range-after="3"
        @change="paginate"
      />
    </div>
  </require-fetch-template>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import PlayerPageHeader from '../components/PlayerPageHeader.vue';
import RequireFetchTemplate from '../components/RequireFetchTemplate.vue';
import RequireFetchBase from '../components/RequireFetchBase.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';

@Component({
  name: 'latestResults',
  components: { PlayerPageHeader, RequireFetchTemplate },
})
export default class latestResults extends RequireFetchBase {
  currentPage = this.$route.query.page || 1;

  get apiPath() {
    return `results?page=${this.$route.query.page || 1}`;
  }
  get user() {
    return this.latestResults && this.latestResults.user ? this.latestResults.user : null;
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
  toResultPage(resultId) {
    this.$router.push({ name: 'results.detail', params: { resultId } });
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
