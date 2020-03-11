import { BossIdKeys, PlayerId } from './salmon-stats';

interface Boss {
  key: string;
  name?: string; // optional: unnecessary
}

interface BossCount {
  count: number;
  boss?: Boss;
}

type BossCounts = { [key in BossIdKeys]: BossKillCount };

interface BossKillCount {
  count: number;
  boss?: Boss;
}

type BossKillCounts = { [key in BossIdKeys]: BossKillCount };

interface Grade {
  id:
    '1' | // Apprentice
    '2' | // Part-Timer
    '3' | // Go-Getter
    '4' | // Overachiever
    '5'; // Profreshional
  name?: string; // optional: unnecessary
  long_name?: string; // optional: unnecessary
  short_name?: string; // optional: unnecessary
}

interface Special {
  name?: string; // optional: unnecessary
  id: string;
  image_a?: string; // optional: unnecessary
  image_b?: string; // optional: unnecessary
}

interface PlayerResult {
  weapon_list: Array<
    {
      id: string;
      weapon?: Weapon,
    }
  >;
  pid: PlayerId;
  special_counts: number[];
  dead_count: number;
  help_count: number;
  ikura_num: number;
  golden_ikura_num: number;
  name: string;
  boss_kill_counts: BossKillCounts;
  special: Special;
  player_type?: PlayerType; // optional: unused
}

type Style = 'girl' | 'boy';
type Species = 'inklings' | 'octolings';
interface PlayerType {
  style: Style;
  species: Species;
}

interface Weapon {
  thumbnail?: string; // optional: unnecessary
  name?: string; // optional: unnecessary
  id: string;
  image?: string; // optional: unnecessary
}

interface CoopSpecialWeapon {
  coop_special_weapon: {
    name: string;
    image: string;
  }
}

interface Stage {
  name: string;
  image?: string; // optional: unnecessary
}

interface Schedule {
  start_time: number;
  stage: Stage;
  weapons: Array<Weapon | CoopSpecialWeapon>;
  end_time: number;
}

interface JobResult {
  failure_wave: 1 | 2 | 3 | null;
  failure_reason: string | null;
  is_clear?: boolean; // optional: same as !!failure_wave
}

export type EventKey = 'cohock-charge' |
  'fog' |
  'griller' |
  'rush' |
  'the-mothership' |
  'goldie-seeking' |
  'water-levels';

interface EventType {
  key: EventKey;
  name?: string; // optional: unnecessary
}

interface WaterLevel {
  key: 'low' | 'normal' | 'high';
  name?: string; // optional: unnecessary
}

interface WaveDetail {
  golden_ikura_pop_num: number;
  quota_num: number;
  golden_ikura_num: number;
  ikura_num: number;
  event_type: EventType;
  water_level: WaterLevel;
}

interface SalmonResult {
  kuma_point?: number; // optional: unnecessary: =floor(job_score * job_rate)
  job_rate?: number; // optional: unnecessary: can be calucated from grade.id and grade_point
  end_time: number;
  job_score: number;
  start_time: number;
  play_time: number;
  danger_rate: number;
  grade_point_delta: number;
  job_id: number;
  grade_point: number;

  boss_counts: BossCounts;
  player_type?: PlayerType; // optional: unused
  my_result: PlayerResult;
  other_results: PlayerResult[];
  grade: Grade;
  schedule?: Schedule; // optional: unused
  job_result: JobResult;
  wave_details: WaveDetail[];
}

export {
  PlayerResult,
  SalmonResult,
};
