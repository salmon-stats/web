<template>
  <div class="container">
    <template v-if="isFilterVisible">
      <slot />

      <div class="is-flex">
        <button class="button" @click="toggleVisibility">{{ isFilterVisible ? 'Close' : 'Open' }} filters</button>
        <div>
          <button class="button is-danger" @click="$emit('clear')">Clear</button>
          <button class="button is-success" @click="$emit('search')">Apply</button>
        </div>
      </div>
    </template>
    <div v-else class="visibility-button to-open has-text-centered">
      <button class="button" @click="toggleVisibility">{{ isFilterVisible ? 'Close' : 'Open' }} filters</button>
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
import { Vue, Component, PropSync, Prop } from 'vue-property-decorator';

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
