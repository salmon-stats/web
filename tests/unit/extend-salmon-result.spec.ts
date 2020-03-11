import { ParsedPlayerResult } from '@/types/parsed-salmon-result';
import { extendSalmonResult } from '@/extend-salmon-result';
import apiSalmonResult from '@/../tests/unit/api-salmon-result.json';

describe('salmon-job.ts', () => {
  const result = extendSalmonResult(apiSalmonResult);

  it('extendSalmonResult() should add property .total_result', () => {
    expect(apiSalmonResult).not.toHaveProperty('total_result');
    expect(result).toHaveProperty('total_result');
  });
  it('.total_result.rescue should be some of .player_result[].rescue', () => {
    const helpCount = result
      .player_results
      .reduce((sum: number, playerResult: ParsedPlayerResult) => sum + playerResult.rescue, 0);
    expect(result.total_result.rescue).toBe(helpCount);
  });

  it('extendSalmonResult() should add property .highest', () => {
    expect(apiSalmonResult).not.toHaveProperty('highest');
    expect(result).toHaveProperty('highest');
  });
  it('.highest.rescue should be highest item of .player_result[].rescue', () => {
    expect(result.highest.rescue).toBe(3);
  });
});
