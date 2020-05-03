<template>
  <span :class="isMaxHazard(hazardLevel) ? 'max-hazard' : null"> {{ hazardLevel }}% </span>
</template>

<script lang="ts">
import { isMaxHazard } from '@/helper';

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'HazardLevel',
})
export default class HazardLevel extends Vue {
  @Prop({ required: true, type: String })
  hazardLevel!: string;

  isMaxHazard = isMaxHazard;
}
</script>
