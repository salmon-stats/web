<template>
  <tr
    :class="[record ? 'clickable' : null, isValidEvent ? null : 'weak']"
    @click="record ? toResultPage(record.id) : null"
  >
    <th>{{ heading }}</th>
    <td v-for="eggKind in ['golden_eggs', 'power_eggs']">
      <div v-if="record">
        <span :class="getClassNames(isValidEvent, eggKind)">{{ record[eggKind] }}</span>
        <div>
          <router-link
            v-for="member in getMembersMetadata(record.members)"
            :key="member.playerId"
            @click.stop.native
            :to="`/players/${member.playerId}`"
          >
            <player-avatar class="avatar" :size="member.isRegistered ? 32 : 24" :user="member">
              {{ record.members }}
            </player-avatar>
          </router-link>
        </div>
      </div>
      <span v-else-if="isValidEvent">N/A</span>
      <span v-else>-</span>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue';

import PlayerAvatar from '@/components/PlayerAvatar.vue';
import RouterHelperMixin from '@/helpers/router-helper';
import { playersModule } from '@/store/modules/players';
import { sortPlayersData } from '../helpers/helper';
import { UserData } from '../types/salmon-stats';

type EggKind = keyof typeof classNameTable;

const classNameTable = {
  golden_eggs: 'golden-egg',
  power_eggs: 'power-egg',
} as const;
export const eggKinds = Object.keys(classNameTable) as EggKind[];

export default Vue.extend({
  components: { PlayerAvatar },
  mixins: [RouterHelperMixin],
  props: {
    isValidEvent: {
      type: Boolean,
      required: true,
    },
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
    getClassNames(isValidEvent: boolean, eggKind: keyof typeof classNameTable): string[] {
      const classNames: string[] = [classNameTable[eggKind]];

      if (this.recordType === eggKind) {
        classNames.push('highlight');
      } else {
        const alsoRecordsOf = eggKinds.filter((kind) => kind !== eggKind)
          .filter((otherKind) => this.records[otherKind][eggKind] === this.records[eggKind][eggKind]);

        if (alsoRecordsOf.includes(this.recordType as EggKind)) {
          classNames.push('highlight');
        }
      }

      return classNames;
    },
    getMembersMetadata(ids: string[]): UserData[] {
      const players = ids.map((id) => playersModule.players.get(id)).filter(Boolean) as UserData[];
      return sortPlayersData(players);
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@/assets/bulma-variables.scss';

.highlight {
  font-weight: bold;
}

:not(:last-child) .avatar {
  margin-left: 0.25em;
}

.weak { color: darken($text, 10%); }
</style>
