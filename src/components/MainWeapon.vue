<template>
  <img @mouseover="onMouseover" @mouseleave="onMouseleave"
    :class="classNames" :src="weaponIcon('weapon', weaponId)">
</template>

<style scoped>
.use-highlight.is-highlighted {
  background-color: rgba(255, 158, 140, 0.25);
}
</style>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { weaponIcon } from '../helper';
import { uiStateModule } from '../store/modules/ui-state';

@Component({
  name: 'MainWeapon',
  props: {
    weaponId: [Number, String],
    highlightOnHover: {
      type: Boolean,
      default: true,
    },
  },
})
export default class MainWeapon extends Vue {
  weaponIcon = weaponIcon;

  get isHighlighted() {
    return uiStateModule.highlightedWeaponId === this.weaponId;
  }
  get classNames() {
    return {
      'use-highlight': this.highlightOnHover,
      'is-highlighted': this.isHighlighted,
    };
  }

  onMouseover() {
    if (this.highlightOnHover) {
      uiStateModule.setHighlightedWeaponId(this.weaponId);
    }
  }
  onMouseleave(e) {
    if (this.highlightOnHover) {
      uiStateModule.unsetHighlightedWeaponId();
    }
  }
}
</script>
