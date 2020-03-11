<template>
  <div class="container">
    <template v-if="isFilterVisible">
      <slot />

      <div class="is-open has-text-centered">
        <button class="button to-close" @click="toggleVisibility">{{ isFilterVisible ? 'Close' : 'Open' }} filters</button>
        <button class="button is-success">Search with filters</button>
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

  .to-close {
    margin-right: 1em;
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
