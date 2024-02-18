/*
 * Copyright 2024 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: 微信工具
 * @Author: lspriv
 * @LastEditTime: 2024-02-18 08:24:18
 */
import { Voidable } from './shared';

export type BoundingClientRects = Array<WechatMiniprogram.BoundingClientRectCallbackResult>;

export type ComponentInstance = WechatMiniprogram.Component.Instance<
  WechatMiniprogram.Component.DataOption,
  WechatMiniprogram.Component.PropertyOption,
  WechatMiniprogram.Component.MethodOption
>;

interface WxApiPromisifableOpts {
  success?(result: any): void;
  fail?(error: any): void;
}

interface WxApiPromisifable {
  (options: WxApiPromisifableOpts): any;
}

type WxApiSuccess<T extends WxApiPromisifable> = Parameters<T>[0]['success'];

type WxApiPromisyOpts<T extends WxApiPromisifable> = Omit<Parameters<T>[0], 'success' | 'fail' | 'complete'>;

type WxApiPromisyReturn<T extends WxApiPromisifable, F = WxApiSuccess<T>> = F extends (...args: any[]) => any
  ? Parameters<F>[0]
  : never;

export const wxPromisify = <T extends WxApiPromisifable>(
  wxapi: T,
  options?: WxApiPromisyOpts<T>
): Promise<WxApiPromisyReturn<T>> => {
  return new Promise((resolve, reject) => {
    wxapi({
      ...options,
      success: result => {
        resolve(result);
      },
      fail: error => {
        reject(error);
      }
    });
  });
};
