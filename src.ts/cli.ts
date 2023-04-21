import { TextVerifiedClient } from "./textverified";
import yargs from "yargs";
import { camelCase } from "change-case";
import fs from "fs-extra";
import util from "util";
import "setimmediate";
import mkdirp from "mkdirp"
import path from "path";
import { getLogger } from "./logger";

const logger = getLogger();

export async function saveSession(textverified, json = false, filename = 'session.json') {
  await mkdirp(path.join(process.env.HOME, '.textverified'));

  await fs.writeFile(path.join(process.env.HOME, '.textverified', filename), textverified.toJSON());
  if (!json) logger.info('saved to ~/' + path.join('.textverified', filename));
}
  

export async function initSession() {
  const textverified = new TextVerifiedClient({ simpleAccessToken: process.env.TEXTVERIFIED_TOKEN });
  await textverified.simpleAuthenticate();
  logger.info('got JWT!');

  logger.info(textverified.bearer);
  await saveSession(textverified);
}

export async function loadSession() {
  return TextVerifiedClient.fromJSON(await fs.readFile(path.join(process.env.HOME, '.textverified', 'session.json')));
}

export async function callAPI(command, data) {
  const textverified = await loadSession();
  const camelCommand = camelCase(command);
  const json = data.j || data.json;
  delete data.j
  delete data.json;
  if (!textverified[camelCommand]) throw Error('command not foud: ' + command);
  const result = await textverified[camelCommand](data);
  if (json) console.log(JSON.stringify(result, null, 2));
  else logger.info(result);
  if (camelCommand === 'simpleAuthenticate' || camelCommand === 'authenticate' || camelCommand === 'createVerification') await saveSession(textverified, json);
  return result;
}

export async function saveSessionAs(name) {
  const textverified = await loadSession();
  await saveSession(textverified, false, name + '.json');
}

export async function loadSessionFrom(name) {
  const textverified = TextVerifiedClient.fromObject(require(path.join(process.env.HOME, '.textverified', name)));
  await saveSession(textverified);
}
  
export async function loadFiles(data: any) {
  const fields = [];
  for (let [ k, v ] of Object.entries(data)) {
    const parts = /(^.*)FromFile$/.exec(k);
    if (parts) {
      const key = parts[1];
      fields.push([key, await fs.readFile(v)]);
    } else {
      fields.push([k, v]);
    }
  }
  return fields.reduce((r, [k, v]) => {
    r[k] = v;
    return r;
  }, {});
}
      

export async function runCLI() {
  const [ command ] = yargs.argv._;
  const options = Object.assign({}, yargs.argv);
  delete options._;
  const data = await loadFiles(Object.entries(options).reduce((r, [ k, v ]) => {
    r[camelCase(k)] = String(v);
    return r;
  }, {}));
  switch (command) {
    case 'init':
      return await initSession();
      break;
    case 'save':
      return await saveSessionAs(yargs.argv._[1]);
      break;
    case 'load':
      return await loadSessionFrom(yargs.argv._[1]);
      break;
    default: 
      return await callAPI(yargs.argv._[0], data);
      break;
  }
}
