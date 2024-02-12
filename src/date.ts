/*
 * Copyright 2024 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: 日期计算
 * @Author: lspriv
 * @LastEditTime: 2024-02-12 08:32:20
 */
import { isDate, isNumber, isString } from './shared';
export interface CalendarDay {
  year: number;
  month: number;
  day: number;
  week?: number;
  today?: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number;
}

export type CalendarYear = number;

export const WEEKS = '日一二三四五六';

export const GREGORIAN_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * 获取某个月份的天数
 * @param mon 月份
 */
export const getMonthDays = (mon: CalendarMonth) => {
  return new Date(mon.year, mon.month, 0).getDate();
};

/**
 * 判断两个日期是否是同一天
 */
export const isSameDate = (d1: CalendarDay, d2: CalendarDay) => {
  return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
};

/**
 * 是否今日
 * @param date
 */
export const isToday = (date: CalendarDay) => isSameDate(date, Today || date);

export function normalDate(fuzzy: string | number | Date | CalendarDay): CalendarDay;
export function normalDate(year: number, month: number, day: number): CalendarDay;
export function normalDate(
  fuzzy: string | number | Date | CalendarDay,
  month?: number,
  day?: number
): CalendarDay | null {
  if (!fuzzy) return null;
  const date = isString(fuzzy)
    ? new Date(fuzzy)
    : isNumber(fuzzy)
      ? month !== undefined && day !== undefined
        ? new Date(fuzzy, month - 1, day)
        : new Date(fuzzy)
      : isDate(fuzzy)
        ? fuzzy
        : new Date(fuzzy.year, fuzzy.month - 1, fuzzy.day);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = date.getDay();
  const today = isToday({ year: y, month: m, day: d });
  return { year: y, month: m, day: d, week: w, today };
}

/**
 * 计算与指定日期相差几天的日期
 * @param date 指定日期
 * @param offset 差值，单位天
 */
export const offsetDate = (date: CalendarDay, offset: number) => {
  return normalDate(date.year, date.month, date.day + offset);
};

/**
 * 获取指定某年某月某天的日期，若指定天大于指定月的天数，则返回指定月最后一天
 * @param year 指定年
 * @param month 指定月
 * @param day  指定天
 */
export const inMonthDate = (year: number, month: number, day: number) => {
  return normalDate({ year, month, day: Math.min(day, getMonthDays({ year, month })) });
};

/**
 * 根据指定的周首日对星期重新排序
 * @param weekstart 周首日
 */
export const sortWeeks = (weekstart: number) => {
  return WEEKS.slice(weekstart) + WEEKS.slice(0, weekstart);
};

/**
 * 获取指定日期所在的周
 * @param date 指定日期
 * @param weekstart 周首日
 */
export const weekRange = (date: CalendarDay, weekstart: number = 0): [start: Date, end: Date] => {
  const { year, month, day, week } = normalDate(date);
  const first = new Date(year, month - 1, day - (Math.abs(week! + 7 - weekstart) % 7));
  const last = new Date(first.getFullYear(), first.getMonth(), first.getDate() + 6);
  return [first, last];
};

/**
 * 获取指定日期所在第几周
 * @param date 指定日期
 */
export const weekOrder = (date: CalendarDay) => {
  const { year, month, day } = date;
  const curr = new Date(year, month - 1, day);
  const first = new Date(year, 0, 1);
  const diff = Math.round((+curr - +first) / 86400000);
  return Math.ceil((diff + 1) / 7);
};

/**
 * 计算两个月份相距多少个月（完全不考虑天，纯粹按月计算）
 * @param start 起始月
 * @param end 终止月
 */
export const monthDiff = (start: CalendarMonth, end: CalendarMonth) => {
  const yearDiff = end.year - start.year;
  return yearDiff * 12 + end.month - start.month;
};

export const Today = normalDate(new Date());