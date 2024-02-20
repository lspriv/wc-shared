/*
 * Copyright 2023 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: 基础
 * @Author: lspriv
 * @LastEditTime: 2024-02-17 18:42:23
 */
export type PartRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
export type Voidable<T> = T | undefined;
export type Nullable<T> = T | null;

// /** 元组 join */
export type Join<T extends ReadonlyArray<string>, S = ',', U = ''> = T extends readonly [
  infer R,
  ...infer P extends ReadonlyArray<string>
]
  ? `${U & string}${R & string}${Join<P, S, S>}`
  : '';

/** 下划线（snake_case）转小驼峰（lowerCamelCase） */
export type SnakeToLowerCamel<T extends string, K = Lowercase<T>> = K extends `${infer R}_${infer P}`
  ? `${R}${Capitalize<SnakeToLowerCamel<P, P>>}`
  : K;

/** 小驼峰（lowerCamelCase）转下划线（snake_case） */
export type LowerCamelToSnake<T extends string> = T extends `${infer R}${infer P}`
  ? R extends Lowercase<R>
    ? `${R}${LowerCamelToSnake<P>}`
    : `_${Lowercase<R>}${LowerCamelToSnake<P>}`
  : T;

type AllAwaited<T> = T extends [infer R, ...infer P]
  ? [Awaited<R>, ...AllAwaited<P>]
  : T extends Array<infer Q>
    ? Array<Awaited<Q>>
    : Awaited<T>;
