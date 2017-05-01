module.exports = function( send ) {
  client.on("ready", _ => {
    statusC = client.channels.get(Constants.channels.STATUS);

    send('Chips restart! **' + moment().format('ddd, Do of MMM @ HH:mm:ss.SSS')+'**', statusC);

    console.log('Chips is ready!');
    client.user.setStatus("online");
    client.user.setGame("Do -support","https://twitch.tv/twitch");//client.user.setGame("Updated -help!");

    DMLogger = require("/app/handlers/DMLogger")(Discord, client, dmC, moment);
  });
  hclient.on("ready", _ => {
    testC  = hclient.channels.get(Constants.channels.TEST);
    sLogs  = hclient.channels.get(Constants.channels.SLOGS);
    dmC    = hclient.channels.get(Constants.channels.DMS);
    snLogs = hclient.channels.get(Constants.channels.SNLOGS);

    console.log('Chips helper is ready!');
    hclient.user.setStatus("online");
    hclient.user.setGame("Chips is bae!");
  });
  h2client.on("ready", _ => {
    sxLogs = h2client.channels.get(Constants.channels.SXLOGS);

    console.log('Chips helper 2 is ready!');
    h2client.user.setStatus("online");
    h2client.user.setGame("Chips and Chips helper are bae!");
  });
  h3client.on("ready", _ => {
    sLogs2 = h3client.channels.get(Constants.channels.SLOGS);
    nLogs = h3client.channels.get(Constants.channels.NLOGS);
    stLogs = h3client.channels.get(Constants.channels.STLOGS);

    console.log('Chips helper 3 is ready!');
    h3client.user.setStatus("online");
    h3client.user.setGame("Chips, Chips2 and Chips3 are bae!");
  });
  c2.on("ready", _ => {
    console.log('Bot is ready!');
  });
  c3.on("ready", _ => {
    console.log('Bot2 is ready!');
  });

  client.on("debug", console.log);
  hclient.on("debug", console.log);
  h2client.on("debug", console.log);
  h3client.on("debug", console.log);

  fs.readdirSync("/app/commands").map(f => {
    if (/\.js/.test(f)) {
      console.log("New command loaded!: " + f);
      const precmd = require(`/app/commands/${f}`);
      client.commands[precmd.name] = new Command(precmd);
    }
  });

  client.on("guildMemberAdd",  (member) => {
    /*jshint sub:true*/
    try {
      let memberguild = member.guild;
      let userid= member.user.id;
      if(memberguild.id=="257889450850254848"){
        setTimeout(_ =>{
          console.log("[SINX] adding role...");
          member.addRole(memberguild.roles.find('name',"unverified"));
          console.log("[SINX] sending welcome msg...");
          client.channels.get("307342989783728131").send(`<@${userid}>, Welcome to Sinbadx Knights! **If you would like to get verified and be able to speak in the other channels, please answer the following questions!**
            1. How did you hear about this server?
            2. Why did you join this server?
            3. Do you promise to read <#308361914923089940>?
            4. What is your favorite diep.io tank?
            (you can answer these with just a sentence or two, no need to write an essay!)`);
        }, 500);
      }else if(memberguild.id=="252525368865456130"){
        setTimeout(_ => {
          console.log("[SK] adding role...");
          member.addRole(memberguild.roles.find('name',"lollipop-unverified"));
          console.log("[SK] sending welcome msg...");
          client.channels.get("303587467515396107").send(`<@${userid}>, Welcome! Please read <#307895557815402496> and become acquainted with the rules here, then contact a staff member to be able to speak in other channels!`);
        },500);
      }
    } catch (err) {
      console.log("could not add unverified role");
    }
  });
};
