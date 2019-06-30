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

span {
  display: block;
  height: 5px;
}
.rescue {
  background-color: $rescue;
}
.death {
  background-color: $death;
}
.boss-kill {
  background-color:$boss-elimination;
}
.golden-egg {
  background-color: $golden-egg;
}
.power-egg {
  background-color: $power-egg;
}
.player-1 {
  background-color: $player-1;
}
.player-2 {
  background-color: $player-2;
}
.player-3 {
  background-color: $player-3;
}
.player-4 {
  background-color: $player-4;
}
</style>
