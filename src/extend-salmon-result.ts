import { ExtendedPlayerResult, ExtendedSalmonResult } from '@/types/parsed-salmon-result';

const extendSalmonResult = (result: any): ExtendedSalmonResult => {
  const keysToSumUp = ['rescue', 'death', 'golden_eggs', 'power_eggs', 'total_boss_eliminations'];
  const totalResult: any = {};
  const highest: any = {};

  result.player_results!.forEach((playerResult: Partial<ExtendedPlayerResult>) => {
    const totalBossEliminations = Object.values(playerResult.boss_eliminations!.counts)
      .reduce((sum: number, count: number) => sum + count, 0);
    playerResult.total_boss_eliminations = totalBossEliminations;
  });

  keysToSumUp.forEach((key) => {
    totalResult[key] =
      result.player_results!.reduce((sum: number, p: any) => sum + p[key], 0);
    highest[key] =
      result.player_results!.reduce((max: number, p: any) => p[key] > max ? p[key] : max, 0);
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
