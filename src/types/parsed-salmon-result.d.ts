import { BossIdKeys, PlayerId } from './salmon-stats';

type BossAppearances = { [key in BossIdKeys]: number };

type MemberAccount = {
  id: number;
  name: string;
  player_id?: string;
  twitter_avatar?: string;
  created_at?: string;
  updated_at?: string;
};

type Counts = { [key in BossIdKeys]: number };

type BossEliminations = {
  counts: Counts;
};

type SpecialUses = {
  count: number;
};

type Weapon = {
  weapon_id: number;
};

type ParsedPlayerResult = {
  player_id: string;
  golden_eggs: number;
  power_eggs: number;
  rescue: number;
  death: number;
  special_id: number;
  boss_eliminations: BossEliminations;
  boss_elimination_count: number;
  special_uses: SpecialUses[];
  weapons: Weapon[];
};

type Schedule = {
  schedule_id: string;
  end_at: string;
  weapons: number[];
  stage_id: number;
  rare_weapon_id: number;
};

type Event = {
  id: number;
  key: string;
  name: string;
  splatnet: string;
};

type Water = {
  id: number;
  key: string;
  name: string;
  splatnet: string;
};

type Wave = {
  wave: number;
  golden_egg_quota: number;
  golden_egg_appearances: number;
  golden_egg_delivered: number;
  power_egg_collected: number;
  event: Event;
  water: Water;
};

type ParsedSalmonResult = {
  id: number;
  schedule_id: string;
  start_at: string;
  members: PlayerId[];
  boss_appearances: BossAppearances;
  uploader_user_id: number;
  clear_waves: number;
  fail_reason_id: number | null;
  danger_rate: string;
  created_at: string;
  updated_at: string;
  member_accounts: MemberAccount[];
  player_results: ParsedPlayerResult[];
  schedule: Schedule;
  waves: Wave[];
};

type TotalResult = {
  rescue: number;
  death: number;
  golden_eggs: number;
  normal_eggs: number;
  boss_eliminations: Counts;
  boss_elimination_count: number;
};

type ExtendedSalmonResult = {
  player_results: ParsedPlayerResult[];
  total_result: TotalResult;
  highest: TotalResult;
} & ParsedSalmonResult;

export { BossIdKeys, TotalResult, ParsedSalmonResult, ParsedPlayerResult, MemberAccount, ExtendedSalmonResult };
