const Searcher = require(path.join(__dirname, '../../../handlers/Searcher')).default;

module.exports = {
  name: "points",
  async func(msg, {member, author, content, guild, args, gMember, reply, prefix}) {
    if(!guild||(guild.id!="257889450850254848"&&guild.id!="302983444009451541")) return;
    const used = member || author;
    let dbUser = database.sinxUsers.get(used.id);
    if(args[0]==null){
      if(dbUser!=null)
        return reply(`You have: ${dbUser.pts} points`);
      else
        return reply(`You have no points`);
    }else
    if(args[0]=="add"){
      if(!used.hasPermission("KICK_MEMBERS")){
        switch (used.id) {
          case Constants.users.WILLYZ:
          case Constants.users.PGSUPER:
          case Constants.users.ZALGO:
          case Constants.users.XZLQ:
          case Constants.users.KONEKO:
          case Constants.users.NELYN:
          case Constants.users.LOAF:
          case Constants.users.ARX:
            break;
          default:
            return reply('You must have ``KICK_MEMBERS`` perms to use this command!');
        }
      }

      if(args[2]==null)return reply(`Please specify the amount of points to add: \`\`-points add @/mention/ 123\`\``);
      let pts = parseInt(args[2]);
      if (pts.toString() != args[2]) return reply(`Please enter a valid number of points.`);

      let target, us;
      try{
        target = args[1].match(Constants.patterns.MENTION)[1];
      }catch(err){
        target=args[1];
      }

      if(target!=args[1]){
        try{
          const mem = gMember(target);
          us = database.sinxUsers.get(mem.id);
          database.sheets['members'].addRow({userid: mem.id, username: mem.user.username, points: pts, managerid: author.id, pointsrank: "", time: moment().format('ddd, Do of MMM @ HH:mm:ss.SSS')});
          console.log(`New pts action for user: <@${mem.user.id}>, ${pts} points, approved by: <@${author.id}>`);
          if(database.sinxUsers.get(mem.id)==null){
            database.sinxUsers.set(mem.id, {userid: mem.id, username: mem.user.username, points: pts, managerid: author.id,  pointsrank: "", time: moment().format('ddd, Do of MMM @ HH:mm:ss.SSS')});
            us = database.sinxUsers.get(mem.id);
          }else{
            us.points=parseInt(us.points,10)+pts;
          }
          if(us.points!=0)
            return reply(`[${mem.displayName}] now has: ${us.points} points`);
          else
            return reply(`[${mem.displayName}] now has no points`);
        }catch(err){
          console.log(err);
          //return reply(err);
          return reply(`Errored! Are you sure target user is in Sinbad Knights?`);
        }
      }else{
        return reply(`Errored.`);
      }
    }else
    if(args[0]=="set"){
      if(args[2]==null)return reply(`Please specify the amount of points to add: \`\`-points add @/mention/ 123\`\``);
      let pts = parseInt(args[2]);
      if (pts.toString() != args[2]) return reply(`Please enter a valid number of points.`);

      let target, us;
      try{
        target = args[1].match(Constants.patterns.MENTION)[1];
      }catch(err){
        target=args[1];
      }
      // console.log("Target: "+target);
      if(target!=args[1]){
        try{
          let mem = gMember(target);
          us = database.sinxUsers.get(mem.id);

          if(database.sinxUsers.get(mem.id)==null){
            database.sinxUsers.set(mem.id, {userid: mem.id, username: mem.user.username, points: pts, managerid: author.id, pointsrank: "", time: moment().format('ddd, Do of MMM @ HH:mm:ss.SSS')});
            us = database.sinxUsers.get(mem.id);
          }else{
            database.sheets['members'].addRow({userid: mem.id, username: mem.user.username, points: -parseInt(us.points), pointsrank: "", managerid: author.id, time: moment().format('ddd, Do of MMM @ HH:mm:ss.SSS')});
            us.points=pts;
          }
          database.sheets['members'].addRow({userid: mem.id, username: mem.user.username, points: pts, pointsrank: "", managerid: author.id, time: moment().format('ddd, Do of MMM @ HH:mm:ss.SSS')});
          console.log(`New pts action for user: <@${mem.user.id}>, ${pts} points, approved by: <@${author.id}>`);

          if(us.points!=0)
            return reply(`[${mem.displayName}] now has: ${us.points} points`);
          else
            return reply(`[${mem.displayName}] now has no points`);
        }catch(err){
          return reply(`Are you sure target user is in Sinbad Knights?`);
        }
      }//  time: moment().format('ddd, Do of MMM @ HH:mm:ss.SSS')
    }else{
      let target = content.substring((`${prefix}points `).length);
      await send(`[Debug]Target: ${target}`);
      searchers[guild.id] = new Searcher( guild );

      let mem = searchers[guild.id].searchMember(target);
      await send(`[Debug] memid: ${mem?mem.id:'none'}`);
      // console.log("Target: "+target);
      if(mem==null) return reply(`User [${target}] was not found in this server`);
      let us = database.sinxUsers.get(mem.id);

      if(us&&us.pts!=0)
        return reply(`[${target}] has: ${us.pts} points`);
      else
        return reply(`[${target}] has no points`);
    }
  }
};
