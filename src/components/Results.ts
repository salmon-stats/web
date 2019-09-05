import { Component, Prop, Vue } from 'vue-property-decorator';

import HazardLevel from '@/components/HazardLevel.vue';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import Schedule from '@/components/Schedule.vue';
import { formatDateToMdhm } from '@/helper';

@Component({
  name: 'Results',
  components: { HazardLevel, ProportionalBarChart, Schedule },
})
export default class Results extends Vue {
  @Prop({ default: formatDateToMdhm, type: Function })
  dateFormatter!: Function;

  @Prop()
  paginator?: (toPage: number) => Object;

  @Prop({ default: '' })
  showMoreLink!: string;

  @Prop()
  resultsWithPagination: any;

  @Prop()
  rawResults!: any[];

  public currentPage = 1;

  private get results(): any[] {
    return this.resultsWithPagination ? this.resultsWithPagination.data
      : this.rawResults;
  }

  public paginate(toPage: number) {
    if (!this.paginator) return;

    this.$router.push(
      this.paginator(toPage),
    );
  }

  public toResultPage(resultId: any) {
    this.$router.push({ name: 'results.summary', params: { resultId } });
  }

  public mounted() {
    this.currentPage = parseInt(this.$route.query.page as string, 10) || 1;
  }
}
