<script>
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import { isGrizzcoWeapon } from '@/helpers/helper';

export default {
  props: [
    'value', 'max', 'weapon',
  ],
  render(h) {
    const props = this.$props;

    return (
      <ProportionalBarChart
        chart-key={isGrizzcoWeapon(props.weapon) ? 'golden-egg' : 'rescue'}
        {...{ attrs: props }}
      />
    );
  },
}
</script>
