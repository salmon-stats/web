<template>
  <div class="container">
    <template v-if="isFilterVisible">
      <slot />

      <div class="is-flex">
        <b-button @click="toggleVisibility">{{ isFilterVisible ? 'Close' : 'Open' }} filters</b-button>
        <div>
          <b-button class="is-danger" @click="$emit('clear')">
            Clear
          </b-button>
          <b-button class="is-success" @click="$emit('search')">
            Apply
          </b-button>
        </div>
      </div>
    </template>
    <div v-else class="visibility-button to-open has-text-centered">
      <b-button @click="toggleVisibility">{{ isFilterVisible ? 'Close' : 'Open' }} filters</b-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 1em;

  .is-open {
    margin-top: 1em;
  }

  .to-open {
    margin-bottom: 1em;
  }

  .is-flex {
    margin-top: 1em;
    justify-content: space-between;
  }

  button:not(:first-child) {
    margin-left: 1em;
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ResultsFilterController extends Vue {
  private isFilterVisible = false;

  private toggleVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;

    if (!this.isFilterVisible) {
      this.$emit('close');
    }
  }
}
</script>
