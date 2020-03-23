import { EventKey } from '@/types/salmon-result';

export type PlayerId = string;
export type BossId = string | number;
export type BossIdKeys = '3' | '6' | '9' | '12' | '13' | '14' | '15' | '16' | '21';

export interface Schedule {
  scheduleId: string;
  startAt: Date;
  endAt: Date;
  weapons: number[];
  stageId: number;
  rareWeaponId: null | 20000 | 20010 | 20020 | 20030;
}

export interface UserData {
  isRegistered: boolean;
  isCustomName: boolean;
  playerId: string;
  name: string;
  avatar?: string;
  results?: {
    clear: number;
    fail: number;
  };
  total?: {
    boss_elimination_count: number;
    death: number;
    golden_eggs: number;
    power_eggs: number;
    rescue: number;
  };
}

interface Account {
  user_id: number;
  player_id: string;
  is_primary: boolean;
}

export interface User {
  id: number;
  is_custom_name: boolean;
  is_registered: boolean;
  name: string;
  accounts: Account[];
  twitter_avatar: null | string;
  twitter_id: string;
}

interface MinMax {
  // https://github.com/vuejs/vue/issues/7136
  min?: number | string;
  max?: number | string;
}

interface ResultsFilter {
  golden_egg: MinMax;
  power_egg: MinMax;

  events: EventKey[];
  stages: number[];
  weapons: number[];

  is_cleared?: boolean;
  special?: number;
}

export type FilterType = keyof ResultsFilter;
