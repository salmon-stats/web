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

<style lang="scss" scoped>
@import '../assets/variables.scss';
@import '../assets/helper-functions.scss';

span {
  display: block;
  height: 5px;
}
.rescue {
  @include gradientBackground($rescue);
}
.death {
  @include gradientBackground($death);
}
.boss-kill {
  @include gradientBackground($boss-elimination);
}
.golden-egg {
  @include gradientBackground($golden-egg);
}
.power-egg {
  @include gradientBackground($power-egg);
}
.player-1 {
  @include gradientBackground($player-1);
}
.player-2 {
  @include gradientBackground($player-2);
}
.player-3 {
  @include gradientBackground($player-3);
}
.player-4 {
  @include gradientBackground($player-4);
}
</style>
