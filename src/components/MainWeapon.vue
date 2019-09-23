<template>
  <img :src="iconUrl('weapon', weaponId)" :style="{ height: `${size}px`, width: `${size}px` }">
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { iconUrl } from '../helper';

@Component({
  name: 'MainWeapon',
  props: {
    size: Number,
    weaponId: [Number, String],
  },
})
export default class MainWeapon extends Vue {
  iconUrl = iconUrl;
}
</script>
