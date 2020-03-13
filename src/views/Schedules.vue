<template>
  <require-fetch-template>
    <div class="columns is-multiline">
      <div class="column is-one-third schedule" v-for="schedule in schedules"
        :key="schedule.scheduleId">
        <schedule-card
          :schedule="schedule" />
      </div>
    </div>

    <b-pagination v-if="schedules.length > 0"
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

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import ScheduleCard from '@/components/ScheduleCard.vue';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import { schedulesModule } from '@/store/modules/schedules';
import { parseRawSchedule } from '@/helper.ts';

@Component({
  name: 'Schedules',
  components: { RequireFetchTemplate, ScheduleCard },
})
export default class Schedules extends RequireFetchBase {
  currentPage = 1;

  get apiPath() {
    return `schedules?page=${this.$route.query.page || 1}`;
  }
  get state() {
    return state.data;
  }
  get schedules() {
    return state.data ? state.data.data.map(parseRawSchedule) : [];
  }

  paginate(toPage) {
    this.$router.push(this.paginator(toPage));
  }

  paginator(toPage) {
    return {
      name: this.$route.name,
      query: { page: toPage },
    };
  }

  fetch() {
    state.fetch(this.apiPath)
      .then((res) => {
        if (!res) return;

        res.data.forEach(schedulesModule.setScheduleData);
      });
  }

  mounted() {
    this.currentPage = parseInt(this.$route.query.page, 10) || 1;
    this.fetch();
  }

  @Watch('$route')
  onRouteChange() {
    this.fetch();
  }
}
</script>