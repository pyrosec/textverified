#!/usr/bin/env node
'use strict';

const { runCLI } = require('../lib/cli');

(async () => {
  await runCLI()
})().catch((err) => console.error(err));
