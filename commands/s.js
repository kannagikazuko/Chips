module.exports = {
  name: "s",
  perm: ["server.s"], 
  async func(msg, { send, author, content }) {
    msg.delete();
    if (author.id == Constants.users.WILLYZ || author.id == Constants.users.EVILDEATHPRO){
      content = content.substr(content.indexOf(" ") + 1);
      send(content);
    }
  }
};
