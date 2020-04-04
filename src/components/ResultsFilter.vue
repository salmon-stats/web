<template>
  <div>
    <div class="columns">
      <template v-if="isFilterAvailable('is_cleared')" class="columns">
        <div class="column is-4">
          <form-field label="Result">
            <div class="select is-fullwidth">
              <select v-model="filter.is_cleared">
                <option :value="undefined">-</option>
                <option :value="true">Clear</option>
                <option :value="false">Fail</option>
              </select>
            </div>
          </form-field>
        </div>
      </template>

      <template v-if="isFilterAvailable('weapons')" class="columns">
        <div class="column is-4">
          <form-field label="Weapons">
            <weapon-picker :value.sync="filter.weapons" />
          </form-field>
        </div>
      </template>
    </div>

    <template v-if="isFilterAvailable('golden_egg')">
      <h2><img src="@/assets/golden-egg.png">Golden eggs</h2>
      <div class="columns">
        <div class="column is-4">
          <form-field label="Min">
            <div class="control">
              <input v-model.number="filter.golden_egg.min" type="number" min="0" :max="filter.golden_egg.max" step="1" class="input">
            </div>
          </form-field>
        </div>

        <div class="column is-4">
          <form-field label="Max">
            <div class="control">
              <input v-model.number="filter.golden_egg.max" type="number" :min="filter.golden_egg.min || 0" step="1" class="input">
            </div>
          </form-field>
        </div>
      </div>
    </template>

    <template v-if="isFilterAvailable('power_egg')">
      <h2><img src="@/assets/power-egg.png">Power eggs</h2>
      <div class="columns">
        <div class="column is-4">
          <form-field label="Min">
            <div class="control">
              <input v-model.number="filter.power_egg.min" type="number" min="0" :max="filter.power_egg.max" step="1" class="input">
            </div>
          </form-field>
        </div>

        <div class="column is-4">
          <form-field label="Max">
            <div class="control">
              <input v-model.number="filter.power_egg.max" type="number" :min="filter.power_egg.min || 0" step="1" class="input">
            </div>
          </form-field>
        </div>
      </div>
    </template>

    <template v-if="isFilterAvailable('stages')">
      <h2>Stages</h2>
      <div class="columns">
        <div class="column is-4">
          <form-field>
            <div class="select is-fullwidth is-multiple">
              <select v-model="filter.stages" multiple>
                <option
                  v-for="stageId in stageIds" :key="stageId"
                  :value="stageId"
                >
                  {{ translate('stage', stageId) }}
                </option>
              </select>
            </div>
          </form-field>
        </div>
      </div>
    </template>

    <template v-if="isFilterAvailable('power_egg')">
      <h2>Sort</h2>
      <div class="columns">
        <div class="column is-4">
          <form-field label="By">
            <div class="select is-fullwidth">
              <select v-model="filter.sort_by">
                <option :value="undefined">-</option>
                <option value="golden_egg_delivered">Golden eggs</option>
                <option v-if="isFilterAvailable('player_results')" value="player_golden_eggs">Golden eggs (personal)</option>
                <option value="power_egg_collected">Power eggs</option>
                <option v-if="isFilterAvailable('player_results')" value="player_power_eggs">Golden eggs (personal)</option>
              </select>
            </div>
          </form-field>
        </div>
        <div class="column is-4">
          <form-field label="Order">
            <div class="select is-fullwidth">
              <select v-model="filter.sort_by_order" :disabled="!filter.sort_by">
                <template v-if="filter.sort_by">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </template>
                <option v-else :value="undefined">-</option>
              </select>
            </div>
          </form-field>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
img {
  width: 16px;
  margin-right: .5em;
}
</style>

<script lang="ts">
import { Vue, Component, PropSync, Prop, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { mapGetters } from 'vuex';

import { FilterType, ResultsFilter } from '@/types/salmon-stats';
import { idKeyMapModule } from '@/store/modules/id-key-map';
import { translate } from '@/helper';

import FormField from '@/components/FormField.vue';
import WeaponPicker from '@/components/WeaponPicker.vue';

const allAvailableFilters: FilterType[] = ['is_cleared', 'golden_egg', 'power_egg', 'events', 'stages', 'weapons', 'special', 'player_results'];

export const fieldsWithout = (fieldsToIgnore: FilterType | FilterType[]): FilterType[] => {
  if (!Array.isArray(fieldsToIgnore)) {
    fieldsToIgnore = [fieldsToIgnore];
  }

  return allAvailableFilters.filter((field) => !fieldsToIgnore.includes(field));
};

export const createResultFilter = (): ResultsFilter => ({
  golden_egg: {},
  power_egg: {},
  stages: [],
  events: [],
  weapons: [],
  sort_by: undefined,
  sort_by_order: undefined,
});

export const filterToRequestParams = (filters: ResultsFilter) => {
  const params = {
    min_golden_egg: filters.golden_egg.min,
    max_golden_egg: filters.golden_egg.max,
    min_power_egg: filters.power_egg.min,
    max_power_egg: filters.power_egg.max,
    events: filters.events,
    weapons: filters.weapons,
    is_cleared: filters.is_cleared,
    special: filters.special,
    stages: filters.stages,
    sort_by: filters.sort_by,
    sort_by_order: filters.sort_by_order,
  };

  type RequestParamKey = keyof typeof params;

  (Object.keys(params) as RequestParamKey[])
    // Filters keys to remove
    .filter((key) => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        return true;
      } else if (Array.isArray(params[key])) {
        return (params[key] as any[]).length === 0;
      }

      return false;
    })
    .forEach((key) => delete params[key]);

  return Object.keys(params).length === 0 ? null : params;
};

export const paginatorWithFilters = (route: Route, page: number, filters?: ResultsFilter | null) => {
  const query: { page: number, playerId?: number, filters?: any } = {
    page,
  };

  const toRoute = {
    name: route.name,
    query,
  };

  if (filters) {
    toRoute.query.filters = JSON.stringify(filters);
  } else if (filters !== null && route.query.filters) {
    // null filter means reset.
    toRoute.query.filters = route.query.filters;
  }

  return toRoute;
};

export const restoreFilters = (serialziedFilters: string): ResultsFilter => {
  const defaultFilter = createResultFilter();

  try {
    const filter = JSON.parse(serialziedFilters);

    defaultFilter.is_cleared = typeof filter.is_cleared === 'boolean' ? filter.is_cleared : defaultFilter.is_cleared;
    defaultFilter.golden_egg.min = filter.min_golden_egg || defaultFilter.golden_egg.min;
    defaultFilter.golden_egg.max = filter.max_golden_egg || defaultFilter.golden_egg.max;
    defaultFilter.power_egg.min = filter.min_power_egg || defaultFilter.power_egg.min;
    defaultFilter.power_egg.max = filter.max_power_egg || defaultFilter.power_egg.max;
    defaultFilter.stages = filter.stages ? filter.stages : defaultFilter.stages;
    defaultFilter.weapons = filter.weapons ? filter.weapons : defaultFilter.weapons;
    defaultFilter.sort_by = filter.sort_by ? filter.sort_by : defaultFilter.sort_by;
    defaultFilter.sort_by_order = filter.sort_by_order ? filter.sort_by_order : defaultFilter.sort_by_order;

    return defaultFilter;
  } catch (_) {
    return defaultFilter;
  }
};

@Component({
  name: 'results-filter',
  components: { FormField, WeaponPicker },
  computed: mapGetters('id-key-map', ['stageIds']),
  methods: { translate },
})
export default class ResultsFilterComponent extends Vue {
  @PropSync('value', {
    required: true,
    type: Object,
  })
  private filter!: ResultsFilter;

  @Prop({
    type: Array,
    default: () => allAvailableFilters,
    // validator: (fields: string[]) => fields.every((allAvailableFilters as string[]).includes),
    validator: (fields: string[]) => fields.every((field) => (allAvailableFilters as string[]).includes(field)),
  })
  private readonly availableFilters!: FilterType[];

  private isFilterAvailable(key: FilterType): boolean {
    return this.availableFilters.includes(key);
  }

  @Watch('filter.sort_by')
  private onChangeSortBy(newValue: boolean, oldValue: boolean): void {
    if (!oldValue) {
      this.filter.sort_by_order = 'desc';
    } else if (!newValue) {
      this.filter.sort_by_order = undefined;
    }
  }
}
</script>
