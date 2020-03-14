<template>
  <div class="field is-horizontal">
    <div v-if="label" class="field-label is-normal">
      <label class="label">{{ label }}</label>
    </div>
    <div class="field-body">
      <div class="field">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Prop } from 'vue-property-decorator';

@Component
export default class FormField extends Vue {
  @Prop({
    type: String,
  })
  label?: string;
}
</script>
