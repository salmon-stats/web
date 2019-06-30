<template>
  <div>
    <img :src="weaponIcon('special', specialId)">
    <span class="count">{{ count }}</span>
  </div>
</template>

<style scoped>
div {
  width: 45px;
  height: 32px;
  position: relative;
}
img {
  width: 32px;
  height: 32px;
}
.count {
  font-size: 80%;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0 .125em;
}
</style>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { weaponIcon } from '../helper';

@Component({
  name: 'SpecialUsage',
  props: {
    specialId: [Number, String],
    count: Number,
  },
})
export default class SpecialUsage extends Vue {
  weaponIcon = weaponIcon;
}
</script>
