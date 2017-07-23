'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const Logger = require('../client/Logger').default;
const _ = require('lodash');
const ytdl = require('ytdl-core');

const MusicPlayer = class MusicPlayer {
  constructor (vc, tc) {
    this.voicechannel = vc;
    this.textchannel = tc;
    this.queue = new Array();
    this.looping = false;
  }

  setVC ( newVC ) {
    this.voicechannel = newVC;
  }

  setTC ( newTC ) {
    this.textchannel = newTC;
  }

  joinVC () {
    return new Promise ( async (res, rej) => {
      if(!this.voicechannel||this.shuttingDown) rej(null);

      this.connection = await this.voicechannel.join();
      res(this.connection);
    });
  }

  playNextQueue (){
    if(this.shuttingDown)
      return Logger.log({
        type: 'error',
        msgmodule: 'Music',
        logcategory: 'Player',
        msg: 'Player is shutting down!',
      });
    if (!this.textchannel)
      return Logger.log({
        type: 'error',
        msgmodule: 'Music',
        logcategory: 'Player',
        msg: 'Text Channel is undefined!',
      });

    if (!this.voicechannel) return this.textchannel.send('I am not bound to a voice channel!');
    if (!this.queue||(this.queue.length == 0&&!this.looping)) return this.textchannel.send('There is nothing left in the song queue!');

    this.joinVC().then( () => {
      const song = this.looping?this.lastPlayed:this.queue.shift();

      this.textchannel.send(`Now playing \`${song}\`.`);
      this.lastPlayed = song;

      const stream = ytdl( song );
      this.dispatcher = null;
      this.dispatcher = this.connection.playStream(stream);
      this.dispatcher.setVolume(0.5);

      this.playing = true;
      this.dispatcher.on('debug', info => {
        return Logger.log({
          type: 'debug',
          msgmodule: 'Music',
          logcategory: 'Player',
          msg: info,
        });
      });
      this.dispatcher.on('end', () => {
        this.playing = false;
        if(this.queue.length == 0&&!this.looping&&!this.shuttingDown){
          this.leaveVC();
          this.connection = null;
          this.dispatcher = null;
          this.textchannel.send('Ended! ' + (new Date).toUTCString()+'\nQueue another song!');
        }
        else if(!this.shuttingDown)
          return this.playNextQueue(); //recurse
      });
    });
  }

  leaveVC () {
    return this.voicechannel?this.voicechannel.leave():null;
  }

  shuffleQueue () {
    this.queue = _.shuffle(this.queue);
  }

  queueUrl (url) {
    if(this.shuttingDown) return null;
    this.queue.push(url);
    if(this.textchannel) this.textchannel.send(`Successfully queued ${url}.\nThere ${this.queue.length==1?'is':'are'} now ${this.queue.length} song${this.queue.length==1?'':'s'} in the queue.`);
    if(!this.playing) this.playNextQueue();
  }

  sample () {
    this.queueUrl('https://www.youtube.com/watch?v=h--P8HzYZ74');
  }

  toggleNextLoop (override) {
    if(!override || typeof override !== 'boolean')
      this.looping = !this.looping;
    else
      this.looping = override;
    if(this.textchannel) this.textchannel.send(`Successfully toggled looping of \`${this.lastPlayed}\` to ${this.looping}`);
  }

  setVolume ( v ) {
    if(this.shuttingDown) return null;
    if(v<0)v=0;
    if(v>200)v=200;

    this.dispatcher.setVolume(~~v/100);
    if(this.textchannel) this.textchannel.send(`Successfully set volume to ${v}%`);
  }

  shutDown () {
    this.shuttingDown = true;
    this.dispatcher.setVolume(0);

    this.queue = [];
    this.looping = false;
    this.dispatcher.end('Force shutdown');
    this.leaveVC();
    this.voicechannel = null;
    if(this.textchannel) this.textchannel.send('Forcing shutdown...').then(()=>this.textchannel=null);
    this.dispatcher = null;
    this.playing = false;
  }

  skip () {
    if(this.shuttingDown) return;
    if(this.textchannel) this.textchannel.send('Skipping song...');
    this.playing = false;

    const disp = this.dispatcher;
    this.dispatcher = null;
    disp.pause();
    this.connection.disconnect();
    this.connection = null;
  }

  pause() {
    if(this.shuttingDown) return;
    if(this.textchannel) this.textchannel.send('Pausing song...');
    this.dispatcher.pause();
  }

  unpause() {
    if(this.shuttingDown) return;
    if(this.textchannel) this.textchannel.send('Resuming song...');
    this.dispatcher.resume();
  }
};

exports.default = MusicPlayer;
