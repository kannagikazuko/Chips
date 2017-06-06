const Jimp = require('jimp');
const fs = require('fs');

module.exports = {
  name: "profile",
  perm: ["server.help"],
  async func(msg, { send }) {
    try{
      let timestamp = cpu.hrtime();

      let image = (await Jimp.read(path.join(__dirname,'../../../public/img/chipssplash.png'))).clone();
      let filepath= "profile."+timestamp + image.getExtension();

      await send('',{files: [filepath]});
      fs.unlinkSync(filepath);
      /*
      image = await Jimp.read(path.join(__dirname,'../../../public/image/loading.gif'));
      await send('',{files: [image]});
      image = await Jimp.read(path.join(__dirname,'../../../public/image/bg.jpg'));
      await send('',{files: [image]});*/
    }catch (err){
      console.error(err);
    }
  }
};
