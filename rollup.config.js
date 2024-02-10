/*
 * Copyright 2024 lspriv. All Rights Reserved.
 * Distributed under MIT license.
 * See File LICENSE for detail or copy at https://opensource.org/licenses/MIT
 * @Description: Description
 * @Author: lspriv
 * @LastEditTime: 2024-02-10 16:12:11
 */
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import clear from 'rollup-plugin-cleaner';
import size from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

import 'colors';

const padding = number => (number < 10 ? `0${number}` : number);
const now = () => {
  const date = new Date();
  return `${padding(date.getHours())}:${padding(date.getMinutes())}:${padding(date.getSeconds())}`;
};

const isDevelop = process.env.NODE_ENV === 'develop';
const DEV_OUTDIR = 'dev/shared';
const PRO_OUTDIR = 'dist';

const OUTDIR = isDevelop ? DEV_OUTDIR : PRO_OUTDIR;

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.ts',
  output: [
    {
      file: `${OUTDIR}/index.js`,
      format: 'cjs'
    }
  ],
  treeshake: {
    preset: 'smallest',
    moduleSideEffects: false,
    propertyReadSideEffects: false
  },
  plugins: [
    clear({
      targets: [DEV_OUTDIR, PRO_OUTDIR],
      silent: true
    }),
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      outDir: OUTDIR
    }),
    commonjs({
      include: [/node_modules/, /src/],
      extensions: ['.js', '.ts']
    }),
    !isDevelop &&
      terser({
        compress: {
          drop_console: !isDevelop,
          drop_debugger: true,
          global_defs: {
            $_VERSION: pkg.version
          },
          reduce_funcs: false,
          directives: false
        },
        mangle: {
          toplevel: true
        },
        output: {
          comments: /^!/
        }
      }),
    size({
      reporter: function (options, bundle, info) {
        return `[${now().grey}] ` + `pack complete`.cyan + ` ${info.fileName.blue} ${info.bundleSize.magenta}`;
      }
    })
  ],
  watch: {
    include: 'src/**',
    skipWrite: false
  }
};
