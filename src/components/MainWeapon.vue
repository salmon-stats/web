<template>
  <img :src="weaponIcon('weapon', weaponId)">
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { weaponIcon } from '../helper';

@Component({
  name: 'MainWeapon',
  props: {
    weaponId: [Number, String],
  },
})
export default class MainWeapon extends Vue {
  weaponIcon = weaponIcon;
}
</script>
