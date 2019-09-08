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
  playerId: string;
  name: string;
  avatar?: string;
}

export interface User {
  id: number;
  name: string;
  player_id: PlayerId;
  twitter_id: string;
}
