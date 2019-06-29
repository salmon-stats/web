<template>
  <span :class="chartKey" :style="{ width }"></span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'ProportionalBarChart',
})
export default class ProportionalBarChart extends Vue {
  @Prop() chartKey!: string;
  @Prop() value!: number;
  @Prop() highest!: number;

  get width() {
    return this.highest === 0 ? '0' : `${this.value / this.highest * 100}%`;
  }
}
</script>

<style scoped>
span {
  display: block;
  height: 5px;
}
.rescue {
  background-color: #2ecc71;
}
.death {
  background-color: #e74c3c;
}
.boss-kill {
  background-color: #9b59b6;
}
.golden-egg {
  background-color: #f1c40f;
}
.power-egg {
  background-color: #e67e22;
}
.player-1 {
  background-color: #e74c3c;
}
.player-2 {
  background-color: #2ecc71;
}
.player-3 {
  background-color: #3498db;
}
.player-4 {
  background-color: #f1c40f;
}
</style>
