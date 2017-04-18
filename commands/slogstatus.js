
module.exports = {
  name: "slogstatus",
  async func(msg, { send, Discord }) {
    let mainContent = new Discord.RichEmbed()
      .setColor(205)
      .addField("Half-Hourly spy update:", "Message count: ",true)
      .setTitle(moment(msg.timestamp).format('ddd, Do of MMM @ HH:mm:ss'))
      .addField("Num msgs in sk: ", `${sMsgs} msgs`)
      .addField("Num msgs in nebula: ", `${nMsgs} msgs`)
      .addField("Num msgs in sinx: ", `${sxMsgs} msgs`);
    statusC.sendEmbed(mainContent);
  }
};
