/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}
