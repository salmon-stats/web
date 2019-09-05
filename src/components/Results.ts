import { ExtendedSalmonResult } from '@/types/parsed-salmon-result';

import { Component, Prop, Vue } from 'vue-property-decorator';

import { formatDateInLocalTz, isMaxHazard } from '@/helper';

@Component({
  name: 'Results',
})
export default class Results extends Vue {
  currentPage: number = 1;

  @Prop()
  paginationCallback: Function | undefined;

  @Prop({ default: '' })
  showMoreLink!: string;

  @Prop()
  resultsWithPagination: any;

  @Prop()
  rawResults!: any[];

  private get results(): any[] {
    return this.resultsWithPagination ? this.resultsWithPagination.data
      : this.rawResults;
  }

  public formatDate(date: any) {
    return formatDateInLocalTz(date, 'MM-DD HH:mm');
  }

  public isMaxHazard = isMaxHazard;

  public toResultPage(resultId: any) {
    this.$router.push({ name: 'results.detail', params: { resultId } });
  }
}
