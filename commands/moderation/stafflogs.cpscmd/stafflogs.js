module.exports = {
  name: "stafflogs",
  async func(msg, { channel, args, guild, send, member }) {
    
    if(!guild)
      return;
    
    let stafflogs = guild.channels.find('name', 'staff-logs');
    
    if(!member.hasPermission("MANAGE_CHANNELS"))
      return send('You need `MANAGE_CHANNELS` permissions to use this command!')
    
    if(stafflogs) 
      return send('You already have a staff-logs channel: ' + stafflogs);  

    if(!args[0])
      return send('Use \"stafflogs set\"!');
    
    if(args[0].match('set'))
    let logs;
       try {
         logs = await guild.createChannel('stafflogs', 'text');
         send(`Created new emoji with name ${stafflogs}!`);
       }catch(err){
         send('The emoji could not be created…');
         throw err;
       }   

  }
}
