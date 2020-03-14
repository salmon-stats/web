<template>
  <img :src="iconUrl('weapon', id)">
</template>

<style lang="scss" scoped>
img {
  min-width: 32px;
  width: 32px;
  height: 32px;
}
</style>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { iconUrl } from '@/helper';

@Component({
  methods: { iconUrl },
})
export default class WeaponImage extends Vue {
  @Prop({
    type: [String, Number],
    required: true,
  })
  id!: number | string;
};
</script>
