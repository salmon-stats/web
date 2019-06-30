import { ExtendedPlayerResult, ExtendedSalmonResult } from '@/types/parsed-salmon-result';

const extendSalmonResult = (result: any): ExtendedSalmonResult => {
  // Note: 'boss_eliminations' is not included here.
  const keysToSumUp = ['rescue', 'death', 'golden_eggs', 'power_eggs', 'total_boss_eliminations'];
  const totalResult: any = { boss_eliminations: {} };
  const highest: any = { boss_eliminations: {} };

  result.player_results!.forEach((playerResult: Partial<ExtendedPlayerResult>) => {
    const totalBossEliminations = Object.values(playerResult.boss_eliminations!.counts)
      .reduce((sum: number, count: number) => sum + count, 0);
    playerResult.total_boss_eliminations = totalBossEliminations;
  });

  // TODO: use bossIds
  [3, 6, 9, 12, 13, 14, 15, 16, 21].forEach((bossId) => {
    const bossEliminationCounts = result.player_results!
      .map((p: any) => p.boss_eliminations.counts[bossId]);
    totalResult.boss_eliminations[bossId] =
      bossEliminationCounts.reduce((sum: number, count: any) => sum + count, 0);
    highest.boss_eliminations[bossId] =
      bossEliminationCounts.reduce((max: number, count: any) => count > max ? count : max, 0);
  });

  keysToSumUp.forEach((key) => {
    totalResult[key] =
      result.player_results!.reduce((sum: number, p: any) => sum + p[key], 0);
    highest[key] =
      Math.max(...result.player_results!.map((p: any) => p[key]));
  });

  const extendedSalmonResult: ExtendedSalmonResult = {
    ...result,
    total_result: totalResult,
    highest,
  };
  return extendedSalmonResult;
};

export {
  extendSalmonResult,
};
