//Chips.js
/** Constants **/
global.Constants = require("./Constants");
//route loading
global.index = require("./routes/index");
global.login = require("./routes/login");
global.useroverview = require("./routes/useroverview");

//Chips constants
const child_process = require('child_process');
const stdin = process.openStdin();
const readline = require('readline');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('./lib').Strategy;
const fs = require('fs');
const request = require('request');
const app = require("./AppSetup")(bodyParser, cookieParser, passport, express, express(), Strategy, session);
const favicon = require('serve-favicon');
const Discord = require("discord.js");
const client = new Discord.Client();
const hclient = new Discord.Client();
const h2client = new Discord.Client();
const c2 = new Discord.Client();
const c3 = new Discord.Client();
client.commands = {};
const prefix = "-";
//user submission step stored by id
let submStep = {'id0': -1};

//steps {stepnum: ["Step1 text", numoptions]}
const steps = {
  0: ["Step 0 text: You've requested -helppt. React with 1 to continue.", 1],
  1: ["Step 1 text: Submission type", 3],
  2: ["Step 2 text: Gamemode", 4]
};
/** End Constants **/

/** Other Global Constants **/
global.moment = require('moment');
global._ = require("lodash");
global.chalk = require("chalk");
global.Messager = new (require("events"));
global.Command = require("./Command");
global.CommandHandler = require("./CommandHandler")(Discord, client);
global.database = require("./DatabaseLoader");
global.DMLogger;
global.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
/** End Global Constants **/
let testC, dmC, nebC, skC, statusC, combinedLogs, combinedLogs2;
let d = "", monitorMode = false, consoleTyping = false, helper2=false;

/** Events **/
//Messenger events
Messager.on("eval", ({ evalContent, vars, timestamp }) => {
  const { msg, message, channel, guild, send, reply, content, noprefix, prefix, c, author, member } = vars;
  console.log("Messager received some eval of " + evalContent);
  try {
    console.log("Messager part: dideval" + timestamp);
    Messager.emit("dideval" + timestamp, {
      result: eval(evalContent),
      err: false
    });
  } catch(err) {
    console.log("Error at eval Messager: " + err);
    Messager.emit("dideval" + timestamp, {
      result: err,
      err: true
    });
  }
});

// Client Events
client.on("debug", console.log);
hclient.on("debug", console.log);
h2client.on("debug", console.log);

client.on("ready", _ => {
  if (client.channels.get(Constants.channels.TEST) == null || client.channels.get(Constants.channels.DMS) == null) console.error("ERRR");
  else {
    statusC = client.channels.get(Constants.channels.STATUS);
    sLogs = client.channels.get(Constants.channels.SLOGS);
    nLogs = client.channels.get(Constants.channels.NLOGS);
    sxLogs = client.channels.get(Constants.channels.SXLOGS);
  }
  send('Chips restart!', statusC);
  console.log('Chips is ready!');
  client.user.setStatus("online");
  client.user.setGame("Updated -help!");
  DMLogger = require("./DMLogger")(Discord, client, dmC, moment);
});
hclient.on("ready", _ => {
  testC = hclient.channels.get(Constants.channels.TEST);
  dmC = hclient.channels.get(Constants.channels.DMS);
  combinedLogs = hclient.channels.get(Constants.channels.COMBINED);
  console.log('Chips helper is ready!');
  hclient.user.setStatus("online");
  hclient.user.setGame("Chips is bae!");
});
h2client.on("ready", _ => {
  combinedLogs2 = h2client.channels.get(Constants.channels.COMBINED);
  console.log('Chips helper 2 is ready!');
  h2client.user.setStatus("online");
  h2client.user.setGame("Chips and Chips2 are bae!");
});
c2.on("ready", _ => {
  console.log('Bot is ready!');
});
c3.on("ready", _ => {
  console.log('Bot2 is ready!');
});

client.on("message", message => {
  if (message.author.bot) return;

  if(message.content.toLowerCase().indexOf("wowbleach")>-1) message.channel.send(" \ _ \ _ \<:Bleach:274628490844962826>\n\ <:WOW:290865903384657920>");

  if (!message.guild){
    return dmHandle(message);
  }

  //console.log(monitorMode);
  if (monitorMode && message.channel == testC) {
    console.log("\n", chalk.bold.bgBlue("Social spy: "), chalk.bgBlack("\n\t[" + message.author.username + "] message content: " + message.content));
  }

  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

  CommandHandler(message, prefix);
});
c2.on('message', m => {
  try{
    //combined
    if(helper2){
      send(`***[${m.guild.name}]*** **[${m.channel.name}]** *[${m.author.username}]*: ${m.content}`,combinedLogs);
      helper2=!helper2;
    }else{
      send(`***[${m.guild.name}]*** **[${m.channel.name}]** *[${m.author.username}]*: ${m.content}`,combinedLogs2);
      helper2=!helper2;
    }

    if(m.guild.id=="252525368865456130") //sk
      send2(m,sLogs);
    if(m.guild.id=="257889450850254848") //sinbad
      send2(m,sxLogs);
  }catch(err){console.log(`Log errored! ${err}`);}
});
c3.on('message', m => {
  try{
    if(m.guild.id=="284433301945581589") //nebula
      send2(m,nLogs);
  }catch(err){console.log(`Log errored! ${err}`);}
});

client.on("messageReactionAdd", (react, user) => {
  if(user.id == client.user.id || react.message.author.id != client.user.id) return;

  console.log("Reaction detected");
  if (react.message.channel.type != 'dm') {
    console.console.log("Not in DM");
    return;
  }

  console.log("DM channel emoji: " + react.emoji);
  react.message.channel.sendMessage(`The emoji used is ${react.emoji}`);

  console.log("userid: " + user.id);
  console.log(`The emoji used is ${react.emoji}`);
  if(react.emoji.toString()=="1⃣"){react.message.channel.sendMessage("Hi: one");}
  else if(react.emoji.toString()==":two:"){react.message.channel.sendMessage("Hi: two");}
  else if(react.emoji.toString()==":three:"){react.message.channel.sendMessage("Hi: three");}
  react.message.delete();
});

//Console events
stdin.addListener('data', d => {
    if (testC == null) {
      return console.log("YOU HAVEN'T DEFINED AN OUTPUT CHANNEL");
    }
    if (consoleTyping == false) {
      consoleTyping = true;
      rl.question("\x1b[1mInput? \x1b[0m", txt => {
        console.log("\x1b[0m", "\tConsole input:", txt);
        if (txt == "") {
          consoleTyping = false;
        } else {
          evalConsoleCommand(txt);
          consoleTyping = false;
        }
      });
    }
});

//Functions
const send = (message, c) => { c.sendMessage(message, {disableEveryone:true}); };

const send2 = (message, c) => {
  if(c==null||message.author.id==client.user.id)return;

  let mainContent = new Discord.RichEmbed()
    .setAuthor(`${message.author.username}#${message.author.discriminator}\nUser ID: ${message.author.id}`)
    .setColor(205)
    .addField("message id:", message.id,true)
    .setThumbnail(message.author.displayAvatarURL)
    .setTitle(moment(message.timestamp).format('ddd, Do of MMM @ HH:mm:ss'));
  if(message.cleanContent == "")
    mainContent.addField(message.author.username, "[ERR]--No Content in Message--");
  else
    mainContent.addField(message.author.username, message.cleanContent);
  if(message.attachments.length>1)
    main.addField("Status:", "More than one attachment received..");
  if(message.attachments.first()!=null) main.addField("Attachment URL: ", message.attachments.first().url);
  c.sendEmbed(mainContent);
};

const evalConsoleCommand = txt => {
  txt = detectPastes(txt);
  if (txt == "monitor") {
    monitorMode = true;
    console.log("\tActivating Monitor Mode");
  } else if (txt == "unmon") {
    monitorMode = false;
    console.log("\tDeactivating Monitor Mode");
  } else {
    send(txt, testC);
  }
};

const detectPastes = txt => {
  const pairPastes = _.toPairs(Constants.PASTES);
  for (const i in pairPastes) {
    if (txt == pairPastes[i][0]) {
      console.log("paste " + i + " found!");
      return pairPastes[i][1];
    }
  }
  return txt;
};

async function dmHandle (message) {
  if(database.sheets[`botlog`]==null) return message.channel.send("Bot is still starting up...");
  DMLogger(message);
  if(message.content==(prefix+"help")){
    message.channel.sendMessage(`Do -helppt`);
    return;
  }
  if(message.content.startsWith(prefix+"helppt")){
    submStep[message.author.id]=0;
    await reactOptions(message);
    console.log("helppt");
  }
}

async function reactOptions(message) {
  let stepNum = submStep[`${message.author.id}`];
  let text = steps[stepNum][0];
  let numChoices = steps[stepNum][1];
  await message.channel.send("You are on step " + stepNum);
  const msg = await message.channel.send(text);
  if (isNaN(numChoices)) throw new TypeError("Number of choices must be a number.");
  if (numChoices > 9) numChoices = 9;
  await msg.react("⬅");
  let index=1;
  do
    await msg.react(Constants.CHOICES[index]);
  while(++index<numChoices+1);
  await msg.react("❌");
}

async function isntMe(react){
  return react.me;
}

function selfping() {
  request("https://chipsbot.herokuapp.com/", _=>_);
}

fs.readdirSync("./commands").map(f => {
  if (/\.js/.test(f)) {
    const precmd = require(`./commands/${f}`);
    client.commands[precmd.name] = new Command(precmd);
  }
});

setInterval(selfping, 1000*60*10);

client.login(process.env.TOKEN);
hclient.login(process.env.HTOKEN);
h2client.login(process.env.H2TOKEN);
c2.login(require('./sBotT.js')[0]);
c3.login(require('./sBotT.js')[1]);
