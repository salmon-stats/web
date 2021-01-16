<template>
  <img :src="iconUrl(weaponType, weaponId)" :style="style" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { iconUrl } from '@/helpers/helper';
import { PropType } from 'vue';

@Component({
  methods: { iconUrl },
})
export default class MainWeapon extends Vue {
  @Prop({
    type: [String, Number],
    required: true,
  })
  weaponId!: number | string;

  @Prop({
    type: String,
    required: true,
  })
  weaponType!: string;

  @Prop({
    type: Number,
    default: 32,
  })
  size!: number;

  get style() {
    const size = `${this.size}px`;

    return {
      minWidth: size,
      width: size,
      height: size,
    };
  }
}
</script>
