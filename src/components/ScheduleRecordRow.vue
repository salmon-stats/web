<template>
  <tr
    :class="record ? 'clickable' : null"
    @click="record ? toResultPage(record.id) : null"
  >
    <th>{{ heading }}</th>
    <td v-for="eggKind in ['golden_eggs', 'power_eggs']">
      <span v-if="record" :class="getClassNames(eggKind)">{{ record[eggKind] }}</span>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue';
import RouterHelperMixin from '@/helpers/router-helper';

type EggKind = keyof typeof classNameTable;

const classNameTable = {
  golden_eggs: 'golden-egg',
  power_eggs: 'power-egg',
} as const;
export const eggKinds = Object.keys(classNameTable) as EggKind[];

export default Vue.extend({
  mixins: [RouterHelperMixin],
  props: {
    recordType: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    records: {
      type: Object,
    },
  },
  computed: {
    record(): { id: number; golden_eggs: number; power_eggs: number; } {
      return this.records[this.recordType];
    },
  },
  methods: {
    getClassNames(eggKind: keyof typeof classNameTable): string[] {
      const classNames: string[] = [classNameTable[eggKind]];

      if (this.recordType === eggKind) {
        classNames.push('highlight');
      }

      return classNames;
    },
  },
});
</script>

<style scoped>
div {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.highlight {
  font-weight: bold;
}
</style>
