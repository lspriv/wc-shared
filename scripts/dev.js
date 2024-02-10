#!/usr/bin/env node
const path = require('path');
const { watch } = require('rollup');
const { loadConfigFile } = require('rollup/loadConfigFile');
const { cli, now } = require('./utils');
const ora = require('ora');

require('colors');

const STDIO_IGNORE = { stdio: 'ignore' };

const spinner = ora();

let Flag = false;
let currTime = 0;

(async function () {
  const result = cli('islogin', false);
  if (!result.login) {
    throw new Error('please login to the devTools');
  }

  spinner.start('loading rollup config');
  const { options, warnings } = await loadConfigFile(path.resolve(process.cwd(), 'rollup.config.js'), {
    bundleConfigAsCjs: true
  });
  spinner.succeed('rollup configuration loaded');

  warnings.count && warnings.flush();

  const watcher = watch(options);
  watcher.on('event', async e => {
    if (e.code === 'START') {
      currTime = process.uptime();
      console.log(`[${now().grey}] Starting ` + `pack`.cyan + `...`);
    }
    if (e.result) e.result.close();
    if (e.code === 'END') {
      const timediff = (process.uptime() - currTime).toFixed(3);
      const timestr = timediff > 1 ? `${timediff} s` : `${timediff * 1000} ms`;
      console.log(`[${now().grey}] Finished ` + `pack`.cyan + ` after ` + timestr.magenta);
      if (Flag) {
        cli('reset-fileutils', true, STDIO_IGNORE);
      } else {
        console.log(`[${now().grey}] Starting ` + `watch`.cyan + `...`);
        cli('open', true, STDIO_IGNORE);
        Flag = true;
      }
    }
    if (e.code === 'ERROR') {
      console.log(`[${now().grey}]`, 'Error'.red, e.error.message);
      watcher.close();
      process.exit(0);
    }
  });
})();
