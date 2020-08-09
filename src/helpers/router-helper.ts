import { Component, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

export const resultPage = (resultId: string | number): RawLocation => ({
  name: 'results.summary',
  params: { resultId: resultId.toString() },
});

export const scheduleResultsPage = (scheduleId: string): RawLocation => ({
  name: 'schedules.results',
  params: { scheduleId },
});

@Component({
  methods: {
    resultPage,
    scheduleResultsPage,
  },
})
export default class ResultHelperMixin extends Vue {
  toResultPage(resultId: string | number): void {
    this.$router.push(resultPage(resultId));
  }
}
