/*
 * Copyright 2024 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: 微信工具
 * @Author: lspriv
 * @LastEditTime: 2024-02-10 16:03:01
 */
import { Voidable } from './shared';

export type BoundingClientRects = Array<WechatMiniprogram.BoundingClientRectCallbackResult>;

export type ComponentInstance = WechatMiniprogram.Component.Instance<
  WechatMiniprogram.Component.DataOption,
  WechatMiniprogram.Component.PropertyOption,
  WechatMiniprogram.Component.MethodOption
>;

/**
 * wx.nextTick promise
 * @param callback
 */
export const nextTick = <
  T extends Voidable<(...args: any[]) => any> = undefined,
  R = T extends NonNullable<T> ? Awaited<ReturnType<T>> : void
>(
  callback?: T
) => {
  return new Promise<R>(resolve => {
    wx.nextTick(() => {
      resolve(callback?.());
    });
  });
};

/**
 * 等待几个片段
 * @param times 等待次数
 */
export const severalTicks = async (times: number) => {
  while (true) {
    if (!times) break;
    await nextTick();
    times--;
  }
};

/**
 * 绑定 worklet动画
 */
export const applyAnimated = (
  instance: ComponentInstance,
  selector: string,
  updater: WechatMiniprogram.Component.AnimatedUpdater,
  options?: WechatMiniprogram.Component.AnimatedUserConfig
) => {
  return new Promise<number>(resolve => {
    instance.applyAnimatedStyle(selector, updater, options, result => {
      resolve(result.styleId);
    });
  });
};

/**
 * 取消 worklet 动画绑定
 */
export const clearAnimated = (instance: ComponentInstance, selector: string, ids: Array<number>) => {
  return new Promise<void>(resolve => {
    instance.clearAnimatedStyle(selector, ids, () => {
      resolve();
    });
  });
};

/**
 * 获取节点信息
 * @param component 组件实例
 */
export const nodeRect = (component: ComponentInstance) => {
  const selectorQuery = component.createSelectorQuery().in(component);
  return (selector: string) =>
    new Promise<BoundingClientRects>((resolve, reject) => {
      selectorQuery
        .selectAll(selector)
        .boundingClientRect(results => {
          const rects = results as unknown as BoundingClientRects;
          if (rects.length) resolve(rects);
          else reject(`view not found by selector ${selector}`);
        })
        .exec();
    });
};

/**
 * 获取页面偏移
 * @param component 组件实例
 */
export const viewportOffset = (component: ComponentInstance) => {
  return new Promise<WechatMiniprogram.ScrollOffsetCallbackResult>(resolve => {
    component.createSelectorQuery().selectViewport().scrollOffset(resolve).exec();
  });
};

/**
 * 合并字符串
 * @param strs 字符串
 * @param separator 分隔符，默认 ','
 */
export const mergeStr = (strs: Array<string>, separator: string = ',') => {
  return strs.flatMap(s => s.split(separator).map(w => w.trim())).join(separator);
};
