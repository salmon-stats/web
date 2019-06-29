<template>
  <div>
    <img v-if="user"
      :width="size" :height="size" :src="user.twitter_avatar">
    <blockies v-else
      :sizePerPixel="blockiesSizePerPixel" :pixels="blockiesPixels" :seed="blockiesSeed" />
    <slot />
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator';
import Blockies from './Blockies.vue';

// Note: size should be divisible by blockiesPixel. (otherwise Blockies will be streched)
const blockiesPixels = 8;

@Component({
  name: 'PlayerAvatar',
  components: { Blockies },
  props: {
    user: {
      default: null,
      type: [Object, null],
    },
    size: {
      type: [Number, undefined],
    },
    blockiesSeed: String,
  },
})
export default class PlayerAvatar extends Vue {
  blockiesPixels = blockiesPixels;
  get blockiesSizePerPixel() {
    return this.size / this.blockiesPixels;
  }
}
</script>
