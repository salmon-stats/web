<script>
import { Vue, Component } from 'vue-property-decorator';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';

Component.registerHooks(['beforeRouteLeave', 'beforeRouteUpdate']);

@Component({
  name: 'RequireFetch',
})
export default class RequireFetch extends Vue {
  beforeRouteLeave(from, to, next) {
    state.reset();
    next();
  }
  beforeRouteUpdate(from, to, next) {
    state.reset();
    next();
  }
}
</script>
