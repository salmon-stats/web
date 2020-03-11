<template>
  <canvas :width="size" :height="size"></canvas>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator';
import { renderIcon } from '@download/blockies';

@Component({
  name: 'Blockies',
  props: {
    sizePerPixel: Number, // TODO: description
    pixels: Number, // TODO: description
    seed: String,
  },
})
export default class Blockies extends Vue {
  get size() {
    return this.sizePerPixel * this.pixels;
  }

  mounted() {
    const canvas = this.$el;
    renderIcon({
      seed: this.seed,
      scale: this.sizePerPixel,
      size: this.pixels,
    }, canvas);
  }
}
</script>
