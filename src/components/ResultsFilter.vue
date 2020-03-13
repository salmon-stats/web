<template>
  <div>
    <div class="columns">
      <div class="column is-4">
        <form-field v-if="isFieldAvailable('is_cleared')" label="Result">
          <div class="select is-fullwidth">
            <select v-model="filter.is_cleared">
              <option :value="undefined">-</option>
              <option :value="true">Clear</option>
              <option :value="false">Fail</option>
            </select>
          </div>
        </form-field>
      </div>
    </div>

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
  </div>
</template>

<style scoped>
img {
  width: 16px;
  margin-right: .5em;
}
</style>

<script lang="ts">
import { Vue, Component, PropSync, Prop } from 'vue-property-decorator';

import FormField from '@/components/FormField.vue';
import { FilterType, ResultsFilter } from '@/types/salmon-stats';

const availableFields: FilterType[] = ['is_cleared', 'golden_egg', 'power_egg', 'events', 'weapons', 'special'];

export const createResultFilter = (): ResultsFilter => ({
  golden_egg: {},
  power_egg: {},
  events: [],
  weapons: [],
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

export const restoreFilters = (serialziedFilters: string): ResultsFilter => {
  const defaultFilter = createResultFilter();

  try {
    const filter = JSON.parse(serialziedFilters);

    defaultFilter.is_cleared = typeof filter.is_cleared === 'boolean' ? filter.is_cleared : defaultFilter.is_cleared;
    defaultFilter.golden_egg.min = filter.min_golden_egg || defaultFilter.golden_egg.min;
    defaultFilter.golden_egg.max = filter.max_golden_egg || defaultFilter.golden_egg.max;
    defaultFilter.power_egg.min = filter.min_power_egg || defaultFilter.power_egg.min;
    defaultFilter.power_egg.max = filter.max_power_egg || defaultFilter.power_egg.max;

    return defaultFilter;
  } catch (_) {
    return defaultFilter;
  }
};

@Component({
  name: 'results-filter',
  components: { FormField },
})
export default class ResultsFilterComponent extends Vue {
  @PropSync('value', {
    required: true,
    type: Object,
  })
  private filter!: ResultsFilter;

  @Prop({
    type: Array,
    default: () => availableFields,
    // validator: (fields: string[]) => fields.every((availableFields as string[]).includes),
    validator: (fields: string[]) => fields.every((field) => (availableFields as string[]).includes(field)),
  })
  private readonly availableFields!: FilterType[];

  private isFieldAvailable(key: FilterType): boolean {
    return this.availableFields.includes(key);
  }
}
</script>