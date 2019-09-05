import { ExtendedSalmonResult } from '@/types/parsed-salmon-result';

import { Component, Prop, Vue } from 'vue-property-decorator';

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

  public toResultPage(resultId: any) {
    this.$router.push({ name: 'results.detail', params: { resultId } });
  }
}
