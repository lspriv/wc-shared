/*
 * Copyright 2024 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: 微信工具
 * @Author: lspriv
 * @LastEditTime: 2024-02-18 10:00:01
 */
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

type WxApiPromisifyOpts<T extends WxApiPromisifable> = Omit<Parameters<T>[0], 'success' | 'fail' | 'complete'>;

type WxApiSuccessResult<T extends WxApiPromisifable> =
  WxApiSuccess<T> extends (...args: any[]) => any ? Parameters<WxApiSuccess<T>>[0] : never;

export const wxPromisify = <T extends WxApiPromisifable>(
  wxapi: T,
  options?: WxApiPromisifyOpts<T>
): Promise<WxApiSuccessResult<T>> => {
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
