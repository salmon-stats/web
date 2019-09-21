<template>
  <div>
    <img :src="iconUrl('special', specialId)">
    <span class="count">{{ count }}</span>
  </div>
</template>

<style lang="scss" scoped>
div {
  width: 32px;
  height: 32px;
  position: relative;
}
img {
  width: 32px;
  height: 32px;
  position: static;
}
.count {
  font-size: 80%;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0 .125em;
  background-color: rgba(0,0,0,0.5);
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
    count: Number,
  },
})
export default class SpecialUsage extends Vue {
  iconUrl = iconUrl;
}
</script>
