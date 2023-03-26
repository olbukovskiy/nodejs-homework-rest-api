const multer = require("multer");
const path = require("path");

const TMP_PATH = path.resolve("./src/temporary-folder");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TMP_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const loadPictureMiddleware = multer({ storage });

module.exports = loadPictureMiddleware;
