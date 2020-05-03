import { ExtendedSalmonResult } from '@/types/parsed-salmon-result';
import { idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';

const extendSalmonResult = (result: any): ExtendedSalmonResult => {
  // Note: 'boss_eliminations' is not included here.
  const keysToSumUp = ['rescue', 'death', 'golden_eggs', 'power_eggs', 'boss_elimination_count'];
  const totalResult: any = { boss_eliminations: {} };
  const highest: any = { boss_eliminations: {} };

  idKeyMap.bossIds.forEach((bossId) => {
    const bossEliminationCounts = result.player_results!.map((p: any) => p.boss_eliminations.counts[bossId]);
    totalResult.boss_eliminations[bossId] = bossEliminationCounts.reduce((sum: number, count: any) => sum + count, 0);
    highest.boss_eliminations[bossId] = bossEliminationCounts.reduce(
      (max: number, count: any) => (count > max ? count : max),
      0,
    );
  });

  keysToSumUp.forEach((key) => {
    totalResult[key] = result.player_results!.reduce((sum: number, p: any) => sum + p[key], 0);
    highest[key] = Math.max(...result.player_results!.map((p: any) => p[key]));
  });

  const extendedSalmonResult: ExtendedSalmonResult = {
    ...result,
    total_result: totalResult,
    highest,
  };
  return extendedSalmonResult;
};

export { extendSalmonResult };
