import { IIdKeyMap, idKeyMapModule as idKeyMap } from '@/store/modules/id-key-map';
import dayjs, { Dayjs } from 'dayjs';

export const iconUrl = (weaponType: string, id: string | number) => {
  return `https://splatoon-stats-api.yuki.games/static/images/${weaponType}/${id}.png`;
};

/**
 * @param key
 * @param id
 */
export const getTranslationKey = (key: keyof IIdKeyMap, id: string | number) => {
    // @ts-ignore
    return `${key}.${idKeyMap[key][id]}`;
};

export const timeDifference = (a: Date | Dayjs, b: Date | Dayjs): string => {
  const diff = Math.abs(dayjs(a).diff(b, 's'));
  return [Math.floor(diff / 3600), Math.floor((diff % 3600) / 60), (diff % 3600) % 60]
    .map(fragment => fragment.toString().padStart(2, '0'))
    .join(':');
}
