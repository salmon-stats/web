import dayjs from 'dayjs';
import { Component, Vue } from 'vue-property-decorator';

import { extendSalmonResult } from '@/extend-salmon-result';
import { BossId, PlayerId } from '@/types/salmon-result';
import { ExtendedSalmonResult, TotalResult, BossIdKeys } from '@/types/parsed-salmon-result';
import { getTranslationKey, iconUrl } from '../helper';
import { IIdKeyMap, idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';
import { requireFetchComponentModule as state } from '@/store/modules/require-fetch-component';
import MainWeapon from '@/components/MainWeapon.vue';
import PlayerAvatar from '@/components/PlayerAvatar.vue';
import ProportionalBarChart from '@/components/ProportionalBarChart.vue';
import SpecialUsage from '@/components/SpecialUsage.vue';
import RequireFetchBase from '@/components/RequireFetchBase.vue';
import RequireFetchTemplate from '@/components/RequireFetchTemplate.vue';

@Component({
  name: 'SalmonResult',
  components: { MainWeapon, PlayerAvatar, ProportionalBarChart, SpecialUsage, RequireFetchTemplate },
})
export default class SalmonResult extends RequireFetchBase {
  public iconUrl = iconUrl;

  get bossIds(): BossIdKeys[] {
    return idKeyMap.bossIds as BossIdKeys[];
  }
  get salmonResult(): ExtendedSalmonResult | null {
    return state.data ? extendSalmonResult(state.data) : null;
  }
  get appearedBossIds(): BossId[] {
    return this.bossIds.filter((bossId) => this.totalBossSpawn(bossId) > 0);
  }
  get failedWave(): number | null {
    const clearWaves = this.salmonResult!.clear_waves;
    return clearWaves ? clearWaves + 1 : null;
  }

  public specialsUsedInWave(wave: number) {
    return this.salmonResult!.player_results
      .map((player) => {
        return {
          id: player.special_id,
          count: player.special_uses[wave - 1].count,
        };
      });
  }
  public convertEpoch(time: number): string {
    return dayjs.unix(time).utc().local().format('YYYY-MM-DD HH:mm:ss');
  }
  public isRegistered(playerId: PlayerId): boolean {
    return !!this.getAccountByPlayerId(playerId);
  }
  public getPlayerAvatar(playerId: PlayerId): string | null {
    const user = this.getAccountByPlayerId(playerId);
    return user ? user.twitter_avatar : null;
  }
  public getPlayerName(playerId: PlayerId): string {
    const user = this.salmonResult!.member_accounts.find((member) =>
      member && member.player_id === playerId);
    return user ? user.name : playerId;
  }
  public translate(key: keyof IIdKeyMap, id: string | number): string {
    return key ? this.$t(getTranslationKey(key, id)) as string : '';
  }
  public hasMost(key: keyof TotalResult, value: number, bossId: BossIdKeys): boolean {
    if (value === 0) {
      return false;
    } else if (key === 'boss_eliminations') {
      return this.salmonResult!.highest[key][bossId] === value;
    }
    return this.salmonResult!.highest[key] === value;
  }
  public hasLeastDeath(value: number): boolean {
    return value === Math.min(...this.salmonResult!.player_results.map(p => p.death));
  }
  public totalBossElimination(bossId: BossIdKeys): number {
    return this.salmonResult!.player_results.reduce(
      (sum: number, p) => sum + p.boss_eliminations.counts[bossId],
      0,
    );
  }
  public totalBossSpawn(bossId: BossIdKeys): number {
    return this.salmonResult!.boss_appearances[bossId];
  }
  public toPlayerSummary(playerId: PlayerId) {
    this.$router.push({ name: 'players.summary', params: { playerId } });
  }
  public getAccountByPlayerId(playerId: PlayerId) {
    return this.salmonResult!.member_accounts.find((member) =>
      member && member.player_id === playerId);
  }
  public sum(collection: number[] | object) {
    let numbers: number[];

    if (!Array.isArray(collection)) {
      numbers = Object.values(collection);
    } else {
      numbers = collection;
    }

    return numbers.reduce((sum: number, item: number) => sum + item, 0);
  }

  public mounted() {
    state.fetch(`results/${this.$route.params.resultId}`);
  }
}
