<template>
  <weapon weapon-type="weapon" :weapon-id="weaponId" :size="size" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { iconUrl } from '@/helpers/helper';
import Weapon from '@/components/Weapon.vue';

@Component({
  components: { Weapon },
  methods: { iconUrl },
})
export default class MainWeapon extends Vue {
  @Prop({
    type: [String, Number],
    required: true,
  })
  weaponId!: number | string;

  @Prop({
    type: Number,
    default: 32,
  })
  size!: number;
}
</script>
