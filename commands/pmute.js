module.exports = {
  name: "pmute",
  perm: ["server.mute"],
  async func(msg, { send, member, author, content, channel, guild, args, gMember, Discord, reply }) {
    const used = member || author;

    if (!args[0]) return send("No user given :(");
    console.log("[Info] Creating new searcher for guild " + guild.id);
    let options = { guild: guild };
    searchers[guild.id] = new Searcher( options.guild );

    const target = args[0].match(Constants.patterns.MENTION)[1];
    // console.log("Target: "+target);
    const split = content.replace(/\s+/g, ' ').trim().split(" ");
    let reason = split.slice(2, split.length).join(" ");
    if (reason == "") reason = "None";

    const mem = gMember(target);

    let list = searchers[guild.id].searchRole("Muted");
    if(list.length>1) console.log("Multiple mute roles found, using first one..");
    else if(list.length<1) return await reply(`A mute role was not found in this server!`);
    let muterole = list[0] || guild.roles.get("295551520425115649");

    mem.addRole(muterole);

    reply(`user <@${mem.id}> perma-muted successfully!`);

    let emb = new Discord.RichEmbed()
      .setAuthor("Mute Log")
      .setTitle(`${mem.displayName} was perma-muted by ${used.displayName}`)
      .setColor(9109504)
      .setThumbnail(Constants.images.WARNING)
      .addField("Mute reason: ", `${reason}`, true);
    channel.send(' ', {embed: emb});
  }
};
