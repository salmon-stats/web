import { Schedule } from '@/types/salmon-stats';
import { IIdKeyMap, idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';
import dayjs, { Dayjs } from 'dayjs';

export const iconUrl = (weaponType: string, id: string | number) => {
  return `https://splatoon-stats-api.yuki.games/static/images/${weaponType}/${id}.png`;
};


/**
 * @param dateString
 * @param formatter
 */
export const formatDateInLocalTz = (dateLikeObject: string | number | Date | Dayjs, formatter: string): string => {
  // Date object is timezone aware
  if (dateLikeObject instanceof Date) {
    return dayjs(dateLikeObject).format(formatter);
  }

  return dayjs(dateLikeObject).utc().format(formatter);
};

/**
 * @param dateLikeObject
 */
export const formatDateToYmdhm = (dateLikeObject: string | number | Date | Dayjs) =>
  formatDateInLocalTz(dateLikeObject, 'YYYY-MM-DD HH:mm');

/**
 * @param dateLikeObject
 */
export const formatDateToMdhm = (dateLikeObject: string | number | Date | Dayjs) =>
  formatDateInLocalTz(dateLikeObject, 'MM-DD HH:mm');

  /**
 * @param dateLikeObject in UTC
 */
export const formatScheduleId = (dateLikeObject: string | number | Date | Dayjs) =>
  dayjs(dateLikeObject).format('YYYYMMDDHH');

/**
 * @param key
 * @param id
 */
export const getTranslationKey = (key: keyof IIdKeyMap, id: string | number) => {
    // @ts-ignore
    return `${key}.${idKeyMap[key][id]}`;
};

export const isMaxHazard = (hazardLevel: any): boolean =>
  parseInt(hazardLevel, 10) === 200;

export const parseRawSchedule = (rawSchedule: any): Schedule => {
  const startAt = dayjs.utc(rawSchedule.schedule_id);
  const endAt = dayjs.utc(rawSchedule.end_at);

  return {
    scheduleId: formatScheduleId(startAt),
    startAt: startAt.toDate(),
    endAt: endAt.toDate(),
    weapons: rawSchedule.weapons,
    stageId: rawSchedule.stage_id,
    rareWeaponId: rawSchedule.rare_weapon_id,
  };
};

export const timeDifference = (a: Date | Dayjs, b: Date | Dayjs): string => {
  const diff = Math.abs(dayjs(a).diff(b, 's'));
  return [Math.floor(diff / 3600), Math.floor((diff % 3600) / 60), (diff % 3600) % 60]
    .map(fragment => fragment.toString().padStart(2, '0'))
    .join(':');
}
