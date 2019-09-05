import { Component, Prop, Vue } from 'vue-property-decorator';

import { formatDateInLocalTz, isMaxHazard } from '@/helper';

@Component({
  name: 'Results',
})
export default class Results extends Vue {
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

  public formatDate(date: any) {
    return formatDateInLocalTz(date, 'MM-DD HH:mm');
  }

  public isMaxHazard = isMaxHazard;

  public paginate(toPage: number) {
    if (!this.paginator) return;

    this.$router.push(
      this.paginator(toPage),
    );
  }

  public toResultPage(resultId: any) {
    this.$router.push({ name: 'results.detail', params: { resultId } });
  }

  public mounted() {
    this.currentPage = parseInt(this.$route.query.page as string, 10) || 1;
  }
}
