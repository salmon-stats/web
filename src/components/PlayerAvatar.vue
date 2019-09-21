<template>
  <img v-if="avatar" :style="style" :src="avatar">
  <blockies v-else :style="style"
    :sizePerPixel="blockiesSizePerPixel" :pixels="blockiesPixels" :seed="blockiesSeed || (user && user.player_id)" />
</template>

<style scoped>
img {
  border-radius: 50%;
}
</style>

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
  get avatar() {
    if (!this.user) return;

    return this.user.avatar || this.user.twitter_avatar;
  }
  get blockiesSizePerPixel() {
    return this.size / this.blockiesPixels;
  }
  get style() {
    return {
      height: `${this.size}px`,
      minWidth: `${this.size}px`,
      width: `${this.size}px`,
    };
  }
}
</script>
