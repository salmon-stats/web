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
            <input v-model.number="filter.golden_egg.min" type="number" min="0" step="1" class="input">
          </div>
        </form-field>
      </div>

      <div class="column is-4">
        <form-field label="Max">
          <div class="control">
            <input v-model.number="filter.golden_egg.max" type="number" min="0" step="1" class="input">
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
