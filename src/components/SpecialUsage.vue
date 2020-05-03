<template>
  <div :style="{ width: `${size}px`, height: `${size}px` }">
    <img :style="{ width: `${size}px`, height: `${size}px` }" :src="iconUrl('special', specialId)" />
    <span v-if="count !== undefined && (!hideCountIfOne || count !== 1)" class="count">{{ count }}</span>
  </div>
</template>

<style lang="scss" scoped>
div {
  position: relative;
}
img {
  position: static;
}
.count {
  font-size: 80%;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0 0.125em;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { iconUrl } from '../helper';

@Component({
  name: 'SpecialUsage',
  props: {
    specialId: [Number, String],
    hideCountIfOne: { type: Boolean, default: false },
    size: { type: Number, default: 32 },
    count: Number,
  },
})
export default class SpecialUsage extends Vue {
  iconUrl = iconUrl;
}
</script>
