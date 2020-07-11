/* eslint-disable prettier/prettier */

export type Nullable<T> = T | null;
export type VoidCallback = () => void;

type Length<T extends any[]> = T['length'];
export type Pop<T extends any[]> = Length<T> extends 0 ? never : (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : []);
