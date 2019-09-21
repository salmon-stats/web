<template>
  <div :class="['box', 'wave',
    failedWave === waveIndex && 'failed-wave',
    ['low', 'normal', 'high'][wave.water_id - 1],
  ]">
    <div class="wave-index">
      <p>{{ waveIndex }}</p>
      <span v-if="failedWave === waveIndex" class="fail">Fail</span>
    </div>
    <div>
      <span class="event">{{ wave.event_id ? translate('event', wave.event_id) : '-' }}</span>
      <div class="special-usages">
        <span class="special-usage" v-for="special in specialsUsedInWave(waveIndex)">
          <special-usage v-if="special.count"
            :special-id="special.id"
            :count="special.count"
            :hide-count-if-one="true"
          />
          <span v-else class="filler" />
        </span>
      </div>
    </div>
    <div class="eggs">
      <div class="header">
        <img src="@/assets/golden-egg.png">
      </div>
      <div class="value">
        <span class="golden-egg">{{ wave.golden_egg_delivered }}</span>/<!--
     --><span class="golden-egg">{{ wave.golden_egg_quota }}</span>
        <span class="total-count">/{{ wave.golden_egg_appearances }}</span>
      </div>

      <div class="header">
        <img src="@/assets/power-egg.png">
      </div>
      <div class="value">
        <span class="power-egg">{{ wave.power_egg_collected }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/bulma-variables.scss';

// TODO: dry
.total-count {
  font-size: 80%;
  &:not(.golden-egg) {
    color: darken($body-color, 20%);
  }
}

//失敗を表す表示
img {
  width: auto;
  height: 16px;
}

.eggs {
  display: grid;
  grid-template-columns: auto 1fr;
  align-content: center;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .value {
    margin-left: .25em;
  }
}

.wave {
  padding: 1em .5em;

  display: grid;
  grid-template-columns: auto auto auto;

  background-color: darken($background, 5%);
  background-image: url('../assets/high-tide.svg');
  background-position: center;
  background-repeat: repeat-x;
  background-size: auto 150%;
  &.high {
    background-position-y: -1em;
  }
  &.normal {
    background-position-y: .5em;
  }
  &.low {
    background-position-y: 2.5em;
  }

  .wave-index {
    text-align: center;
    width: 2em;
  }
}

.tide {
  min-width: 5em;
}
.event {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 32px * 4;
  display: inline-block;
}

.special-usages {
  display: flex;

  .special-usage {
    display: inline-block;
    .filler {
      display: inline-block;
      width: 32px;
    }
  }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';

import SpecialUsage from '@/components/SpecialUsage.vue';

@Component({
  name: 'Wave',
  components: { SpecialUsage },
  props: { result: Object, wave: Object, failedWave: Number, translate: Function },
})
export default class Wave extends Vue {
  get waveIndex() { return this.wave.wave; }

  specialsUsedInWave(waveIndex) {
    return this.result.player_results
      .map((player) => {
        return {
          id: player.special_id,
          count: player.special_uses[waveIndex - 1].count,
        };
      });
  }
}
</script>
