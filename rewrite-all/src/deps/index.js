'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const rrequire = (m) => {
  delete require.cache[require.resolve(m)];
  return require(m);
};
exports.rrequire = rrequire;


const Exporter = class Exporter {
  define (temp, key, modu) {
    Object.defineProperty(temp, key, {
      get: (() => rrequire(modu)),
      configurable: false,
    });
    return temp;
  }
  serialize(){
    const data = {};
    [
      ['discord.js', ['Discord', 'djs']],
      'fs',
      ['lodash',['_','lodash']],
      'path',
      'body-parser',
      'cookie-parser',
      'express',
      'express-session',
      'connect-flash',
      'morgan',
      ['rotating-file-stream', ['rfs','rotating_file_stream']],
      'crypto',
      ['ytdl-core', 'ytdl'],
      'moment',
      'ytsearcher',
      'discordblacklist',
      'pm2',
      'connect-four',
      'needle',
      'request',
      'got',
      'snekfetch',
      'child_process'
    ].forEach(m => {
      if(typeof m === 'string')
        return this.define(data, m, m);
      if(m[1] === undefined)
        return this.define(data, m[0], m[0]);
      if(typeof m[1] === 'string')
        return this.define(data, m[1], m[0]);
      m[1].forEach(k => {
        this.define(data, k, m[0]);
      });
    });

    return data;
  }
};
exports.default = (new Exporter).serialize();
