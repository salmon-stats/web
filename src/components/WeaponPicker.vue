<template>
  <div class="container">
    <div class="is-flex" style="align-items: center;">
      <button class="button" @click="openModal">
        Open
      </button>
      <p style="margin-left: 0.5em;">({{ selectedWeapons.length }}/{{ weapons.length }})</p>
    </div>

    <div :class="['modal', isOpen ? 'is-active' : '']">
      <div class="modal-background" @click="closeModal" />
      <div class="modal-content">
        <div class="modal-controls">
          <button class="button" v-if="isInitialState" @click="selectAll">
            Select All
          </button>
          <button class="button" v-else @click="unselectAll">
            Unselect All
          </button>
          <button class="button is-success" @click="closeModal">
            Close
          </button>
        </div>

        <div
          class="weapon-icon-container"
          v-for="weaponId in weapons"
          :key="weaponId"
          @click="toggleSelection(weaponId)"
        >
          <main-weapon
            :weapon-id="weaponId"
            :class="['weapon-icon', selectedWeapons.includes(weaponId) ? 'is-selected' : '']"
          />
          <span v-if="counts[weaponId]" class="count">{{ counts[weaponId] }}</span>
        </div>
      </div>
    </div>
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

img:not(.is-selected) {
  filter: grayscale(1);
  opacity: 0.5;
}

.weapon-icon-container {
  margin: 8px;
  width: 32px;
  height: 32px;
  display: inline-block;
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

<script lang="ts">
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator';
import { idKeyMapModule } from '@/store/modules/id-key-map';
import MainWeapon from '@/components/MainWeapon.vue';

@Component({
  components: { MainWeapon },
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
