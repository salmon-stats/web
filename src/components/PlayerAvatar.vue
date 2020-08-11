<style scoped>
img {
  border-radius: 50%;
}
</style>

<script lang="tsx">
import Vue from 'vue';
import Blockies from '@/components/Blockies.vue';

// Note: size should be divisible by blockiesPixel. (otherwise Blockies will be streched)
const blockiesPixels = 8;

export default Vue.extend({
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
    showTooltip: {
      type: Boolean,
      default: true,
    },
    blockiesSeed: String,
  },
  computed: {
    avatar() {
      if (!this.user) {
        return;
      }

      return this.user.avatar || this.user.twitter_avatar;
    },
    blockiesSizePerPixel() {
      return this.size / this.blockiesPixels;
    },
    style() {
      return {
        height: `${this.size}px`,
        minWidth: `${this.size}px`,
        width: `${this.size}px`,
      };
    },
  },
  render(h) {
    const { $props: props } = this;

    const child = (
      this.avatar
        ? <img style={this.style} src={this.avatar} />
        : <blockies
            style={this.style}
            sizePerPixel={this.blockiesSizePerPixel}
            pixels={blockiesPixels}
            seed={props.blockiesSeed || (props.user && (props.user.player_id || props.user.playerId))}
          />
    );

    return props.showTooltip && props.user
      ? (
        <b-tooltip label={props.user.name} type="is-black">
          {child}
        </b-tooltip>
      )
      : child;
  },
});
</script>
