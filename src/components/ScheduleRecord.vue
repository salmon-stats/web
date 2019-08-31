<template>
  <div>
    <router-link :to="`/results/${record.id}`">
      <span :class="['golden-egg', recordType === 'golden_eggs' ? 'highlight' : null]">
        {{ record.golden_eggs }}
      </span>
      <span class="text">/</span>
      <span :class="['power-egg', recordType === 'power_eggs' ? 'highlight' : null]">
        {{ record.power_eggs }}
      </span>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/variables.scss';

.text {
  color: $body-color;
}
.highlight {
  font-weight: bold;
}
.golden-egg {
  color: $golden-egg;
}
.power-egg {
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
}
</script>
