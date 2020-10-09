<template>
  <div class="container">
    <div class="is-flex" style="align-items: center;">
      <button class="button" @click="openModal">
        Open
      </button>
      <p style="margin-left: 0.5em;">({{ selectedWeapons.length }}/{{ weapons.length }})</p>
    </div>

    <b-modal :active.sync="isOpen">
      <div class="modal-controls">
        <button class="button" v-if="isInitialState" @click="selectAll">
          Select All
        </button>
        <button class="button" v-else @click="unselectAll">
          Unselect All
        </button>
        <button class="button is-success" @click="closeModal">
          Apply
        </button>
      </div>
      <weapon-count
        v-for="weaponId in weapons"
        :key="weaponId"
        :count="counts[weaponId]"
        :weapon-id="weaponId"
        :class="['weapon-count', selectedWeapons.includes(weaponId) ? 'is-selected' : '']"
        @click.native="toggleSelection(weaponId)"
      />
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.modal {
  padding: 0 1.5em;
  background: $modal-background-color;
}

.modal-controls {
  display: flex;
  justify-content: space-between;
}

::v-deep :not(.is-selected) > img {
  filter: grayscale(1);
  opacity: 0.5;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator';
import { idKeyMapModule } from '@/store/modules/id-key-map';
import WeaponCount from '@/components/WeaponCount.vue';

@Component({
  components: { WeaponCount },
})
export default class WeaponPicker extends Vue {
  get allWeapons(): number[] {
    return idKeyMapModule.weaponIds;
  }
  get isInitialState(): boolean {
    return this.selectedWeapons.length === 0;
  }
  get weapons(): number[] {
    if (this.options.length > 0) {
      return this.allWeapons.filter((weaponId) => this.options.includes(weaponId));
    }
    return this.allWeapons;
  }

  @PropSync('value', {
    type: Array,
  })
  selectedWeapons!: number[];

  @Prop({
    type: Array,
    default: () => [],
  })
  options!: number[];

  @Prop({
    type: Object,
    default: () => ({}),
  })
  counts!: { [key: string]: number };

  isOpen = false;

  closeModal() {
    this.isOpen = false;
  }

  openModal() {
    this.isOpen = true;
  }

  selectAll() {
    this.selectedWeapons = this.weapons.map((weaponId) => weaponId);
  }

  toggleSelection(weaponId: number) {
    if (this.selectedWeapons.includes(weaponId)) {
      this.selectedWeapons = this.selectedWeapons.filter((w) => w !== weaponId);
      return;
    }
    this.selectedWeapons = [...this.selectedWeapons, weaponId];
  }

  initialize() {
    this.unselectAll();
  }

  unselectAll() {
    this.selectedWeapons = [];
  }

  @Watch('options')
  onOptionsUpdate() {
    this.initialize();
  }

  mounted() {
    if (!this.selectedWeapons) {
      this.initialize();
    }
  }
}
</script>
