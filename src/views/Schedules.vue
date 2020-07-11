<template>
  <require-fetch-template>
    <filter-controller v-if="paginator" @clear="filters = createResultFilter()" @search="search">
      <results-filter :value.sync="filters" :available-filters="['stages', 'weapons']" />
    </filter-controller>

    <div class="columns is-multiline">
      <div class="column is-one-third schedule" v-for="schedule in schedules" :key="schedule.scheduleId">
        <schedule-card :schedule="schedule" />
      </div>
    </div>

    <b-pagination
      v-if="schedules.length > 0"
      :total="state.total"
      :current.sync="currentPage"
      :per-page="state.per_page"
      :range-before="3"
      :range-after="3"
      icon-pack="material-icons"
      @change="paginate"
    />
  </require-fetch-template>
</template>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

@media screen and (max-width: $tablet - 1) {
  .schedule:not(:first-child) {
    margin-top: 1em;
  }
}
</style>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import FilterController from '@/components/FilterController.vue';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import ResultsFilterComponent, {
  createResultFilter,
  filterToRequestParams,
  paginatorWithFilters,
} from '@/components/ResultsFilter.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import ScheduleCard from '@/components/ScheduleCard.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { schedulesModule } from '@/store/modules/schedules';
import { parseRawSchedule, mapQueryParamsToApiPath } from '@/helper.ts';
import { Pop } from '@/types/util';
import { ResultsFilter } from '@/types/salmon-stats';

@Component({
  name: 'Schedules',
  components: { FilterController, RequireFetchTemplate, ResultsFilter: ResultsFilterComponent, ScheduleCard },
})
export default class Schedules extends RequireFetchBase {
  public currentPage = 1;
  public filters: ResultsFilter = createResultFilter();

  public get apiPath() {
    return mapQueryParamsToApiPath('schedules', this.$route.query);
  }
  public get state() {
    return state.data;
  }
  get schedules() {
    return state.data ? state.data.data.map(parseRawSchedule) : [];
  }

  public paginate(toPage: number) {
    this.$router.push(this.paginator(toPage) as any);
  }

  public paginator(...args: Pop<Parameters<typeof paginatorWithFilters>>) {
    return paginatorWithFilters(this.$route, ...args);
  }

  private fetch() {
    state.fetch(this.apiPath).then((res) => {
      if (!res) {
        return;
      }

      res.data.forEach((schedule: any) => schedulesModule.setScheduleData(schedule));
    });
  }

  private mounted() {
    this.currentPage = parseInt(this.$route.query.page as string, 10) || 1;
    this.fetch();
  }

  @Watch('$route')
  private onRouteChange() {
    this.fetch();
  }

  private search() {
    if (!this.paginator) {
      return;
    }

    const filters = filterToRequestParams(this.filters);

    this.$router.push(this.paginator(1, filters));
  }
}
</script>
