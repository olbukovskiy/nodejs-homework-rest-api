const jimp = require("jimp");

const resizeAvatar = async (avatarPath) => {
  try {
    const picture = await jimp.read(avatarPath);
    picture.resize(250, 250).quality(60).write(avatarPath);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = resizeAvatar;
