<template>
  <div class="weapon-icon-container">
    <main-weapon :weapon-id="weaponId" />
    <span v-if="count" class="count">{{ count }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MainWeapon from '@/components/MainWeapon.vue';

export default Vue.extend({
  components: { MainWeapon },
  props: {
    weaponId: {
      type: Number,
      required: true,
    },
    count: Number,
  },
});
</script>

<style scoped>
.weapon-icon-container {
  display: inline-block;
  margin: 8px;
  width: 32px;
  height: 32px;
  position: relative;
}

img {
  position: static;
}

.count {
  font-size: 80%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0 0.125em;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
