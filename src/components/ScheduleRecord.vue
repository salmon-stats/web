<template>
  <div :class="className">
    <router-link :to="`/results/${record.id}`">
      <span class="value">{{ value }}</span>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/variables.scss';

.value {
  font-weight: bold;
}
.golden-egg .value {
  color: $golden-egg;
}
.power-egg .value {
  color: $power-egg;
}
</style>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'ScheduleRecord',
  props: {
    record: Object,
    recordType: String,
  },
})
export default class ScheduleRecord extends Vue {
  get value() { return this.record[this.recordType]; }
  get className() {
    return {
      golden_eggs: 'golden-egg',
      power_eggs: 'power-egg',
    }[this.recordType];
  }
}
</script>
