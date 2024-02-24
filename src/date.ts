/*
 * Copyright 2024 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: Description
 * @Author: lspriv
 * @LastEditTime: 2024-02-24 16:56:58
 */

export const DATE_SPLIT = /[ -\/TZ:\.]/;
export const DATE_TIME_PATTERN = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}[ T]\d{1,2}:\d{1,2}:\d{1,2}(\.\d{3})?Z?$/;
export const DATE_PATTERN = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/;

export const dateFormatStr = (str: string): string | null => {
  let splits: string[] | null = null;
  if (DATE_TIME_PATTERN.test(str)) {
    splits = str.split(DATE_SPLIT);
    const [year, month, day, hour, minute, second] = splits;
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  }

  if (DATE_PATTERN.test(str)) {
    splits = splits || str.split(DATE_SPLIT);
    const [year, month, day] = splits;
    return `${year}/${month}/${day} 00:00:00`;
  }

  return null;
};
