<template>
  <span :class="chartKey">
    <span v-if="fillRemainder" class="remainder-filler">
      <span class="chart-body" :style="{ width }" />
    </span>
    <span v-else class="chart-body" :style="{ width }" />
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

type ChartKey =
  | 'rescue'
  | 'death'
  | 'boss-kill'
  | 'golden-egg'
  | 'power-egg'
  | 'player-1'
  | 'player-2'
  | 'player-3'
  | 'player-4'
  | 'rescue-death'
  | 'win-loss';

const chartKeys: ChartKey[] = [
  'rescue',
  'death',
  'boss-kill',
  'golden-egg',
  'power-egg',
  'player-1',
  'player-2',
  'player-3',
  'player-4',
  'rescue-death',
  'win-loss',
];

@Component({
  name: 'ProportionalBarChart',
})
export default class ProportionalBarChart extends Vue {
  @Prop({
    type: String,
    required: true,
    validator: (key: string) => (chartKeys as string[]).includes(key),
  })
  public chartKey!: ChartKey;

  @Prop({
    type: Number,
    required: true,
  })
  public value!: number;

  @Prop({
    type: Number,
    required: true,
  })
  public max!: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  public fillRemainder!: boolean;

  get width(): string {
    return this.max === 0 ? '0' : `${(this.value / this.max) * 100}%`;
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
  .chart-body {
    @include gradientBackground($rescue);
  }
}
.death {
  .chart-body {
    @include gradientBackground($death);
  }
}
.boss-kill {
  .chart-body {
    @include gradientBackground($boss-elimination);
  }
  .remainder-filler {
    @include gradientBackground(lighten($boss-elimination, 30%));
  }
}
.golden-egg {
  .chart-body {
    @include gradientBackground($golden-egg);
  }
}
.power-egg {
  .chart-body {
    @include gradientBackground($power-egg);
  }
}
.player-1 {
  .chart-body {
    @include gradientBackground($player-1);
  }
}
.player-2 {
  .chart-body {
    @include gradientBackground($player-2);
  }
}
.player-3 {
  .chart-body {
    @include gradientBackground($player-3);
  }
}
.player-4 {
  .chart-body {
    @include gradientBackground($player-4);
  }
}

.rescue-death {
  .chart-body {
    @include gradientBackground($rescue);
  }
  .remainder-filler {
    @include gradientBackground($death);
  }
}

.win-loss {
  .chart-body {
    @include gradientBackground($win);
  }
  .remainder-filler {
    @include gradientBackground($loss);
  }
}
</style>
