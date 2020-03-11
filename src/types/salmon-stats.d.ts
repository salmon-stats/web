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

export interface User {
  id: number;
  is_custom_name: boolean;
  is_registered: boolean;
  name: string;
  player_id: PlayerId;
  twitter_avatar: null | string;
  twitter_id: string;
}

interface MinMax {
  min?: number;
  max?: number;
}

interface ResultsFilter {
  golden_egg: MinMax;
  power_egg: MinMax;

  events: EventKey[];
  weapons: number[];

  is_cleared?: boolean;
  special?: number;
}

export type FilterType = keyof ResultsFilter;
