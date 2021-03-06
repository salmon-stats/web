import { Component, Prop, Vue } from 'vue-property-decorator';

import HazardLevel from '@/components/HazardLevel.vue';
import PlayerAvatar from '@/components/PlayerAvatar.vue';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import Schedule from '@/components/Schedule.vue';
import SpecialUsage from '@/components/SpecialUsage.vue';
import MainWeapon from '@/components/MainWeapon.vue';
import ResultsFilterComponent, {
  createResultFilter,
  fieldsWithout,
  filterToRequestParams,
  restoreFilters,
} from '@/components/ResultsFilter.vue';
import FilterController from '@/components/FilterController.vue';
import { formatDateToMdhm, formatDateInLocalTz, formatScheduleId, DateFormatter, sortPlayersData } from '@/helpers/helper';
import { playersModule } from '@/store/modules/players';
import { UserData, User, ResultsFilter, FilterType } from '@/types/salmon-stats';
import { metadataModule } from '@/store/modules/metadata';

@Component({
  name: 'Results',
  components: {
    HazardLevel,
    MainWeapon,
    PlayerAvatar,
    ProportionalBarChart,
    'results-filter': ResultsFilterComponent,
    FilterController,
    Schedule,
    SpecialUsage,
  },
  methods: {
    createResultFilter,
  },
})
export default class Results extends Vue {
  @Prop({ default: formatDateToMdhm, type: Function })
  dateFormatter!: DateFormatter;

  @Prop()
  paginator?: (toPage: number, filters?: object | null) => object;

  @Prop({ default: '' })
  showMoreLink!: string;

  @Prop()
  resultsWithPagination: any;

  @Prop()
  rawResults!: any[];

  @Prop({ default: true })
  isInStartDateOrder!: boolean;

  @Prop({ default: false })
  hideScheduleHeading!: boolean;

  @Prop({
    default: () => fieldsWithout([]),
    type: Array,
  })
  availableFilters!: FilterType[];

  private filters: ResultsFilter = createResultFilter();
  private scheduleIdHeadings = new Set<string>();
  private currentPage = 1;
  private isTeamView = true;
  private formatScheduleId = formatScheduleId;

  public get bossEliminationKey(): string {
    return this.isTeamView ? 'boss_elimination_count' : 'player_boss_elimination_count';
  }

  public get bossEliminationDividerKey(): string {
    return this.isTeamView ? 'boss_appearance_count' : 'boss_elimination_count';
  }

  public get isPlayerResults(): boolean {
    return this.results.some((result) => !!result.power_eggs);
  }

  public get results(): any[] {
    return this.resultsWithPagination ? this.resultsWithPagination.data : this.rawResults;
  }

  public get showScheduleGroupRow(): boolean {
    const hasSorted = this.$route.query.filters && !!JSON.parse(this.$route.query.filters as string).sort_by;
    return !this.hideScheduleHeading && this.isInStartDateOrder && !hasSorted;
  }

  public dateFormatterShort(date: string): string {
    return formatDateInLocalTz(date, 'DD HH:mm');
  }

  public membersData(ids: string | string[]): UserData[] {
    const playerIds = typeof ids === 'string' ? (JSON.parse(ids) as string[]) : ids;

    const players = playerIds
      .map((playerId) => playersModule.players.get(playerId))
      .filter(Boolean) as UserData[];

    return sortPlayersData(players);
  }

  public paginate(toPage: number) {
    if (!this.paginator) {
      return;
    }

    this.$router.push(this.paginator(toPage));
  }

  public profreshionalGradePoint(gradePoint: number): number | null {
    const profreshionalMinGradePoint = 400;
    return gradePoint >= profreshionalMinGradePoint ? gradePoint - profreshionalMinGradePoint : null;
  }

  public scheduleRouter(scheduleId: string) {
    const isPlayerPage = this.$route.name!.includes('players.');
    const params: any = {
      scheduleId: formatScheduleId(scheduleId),
    };

    if (isPlayerPage) {
      params.playerId = this.$route.params.playerId;
    }

    return {
      name: isPlayerPage ? 'players.schedules.summary' : 'schedules.summary',
      params,
    };
  }

  public search() {
    if (!this.paginator) {
      return;
    }

    const filters = filterToRequestParams(this.filters);

    this.$router.push(this.paginator(1, filters));
  }

  public shouldShowScheduleHeading(scheduleId: string): boolean {
    // This is not good because v-if condition shouldn't have side-effects

    if (!this.scheduleIdHeadings.has(scheduleId)) {
      this.scheduleIdHeadings.add(scheduleId);
      return true;
    }

    return false;
  }

  public toResultPage(resultId: any) {
    this.$router.push({ name: 'results.summary', params: { resultId } });
  }

  public mounted() {
    this.currentPage = parseInt(this.$route.query.page as string, 10) || 1;
    this.filters = restoreFilters(this.$route.query.filters as string);

    const members = this.results.flatMap((result) => {
      if (typeof result.members === 'string') {
        return JSON.parse(result.members);
      }
      return result.members;
    });

    playersModule.fetchPlayers(members);
  }

  public beforeUpdate() {
    this.scheduleIdHeadings.clear();
  }
}
