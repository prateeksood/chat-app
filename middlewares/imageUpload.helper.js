const multer = require("multer");
const path = require('path')


const profilePictureStorage = multer.diskStorage({
  destination: (request, file, callBack) => {
    callBack(null, path.join(__dirname, '../public/uploads/profilePictures'));
  },
  filename: (request, file, callBack) => {
    const { _id } = request.user;
    callBack(null, `${_id}_${Date.now()}${path.extname(file.originalname)}`)
  }
});
const profilePictureFilter = (request, file, cb) => {
  const extension = path.extname(file.originalname).substr(1).toLowerCase();
  if (extension === "jpg" || extension === "png" || extension === "jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Kindly upload an imege in one of the following formats: jpg,jpeg,png"), false);
  }
};
const uploadProfilePicture = multer(
  {
    storage: profilePictureStorage,
    fileFilter: profilePictureFilter,
    limits: { fileSize: (5 * 1024 * 1024) }
  }
);
module.exports = uploadProfilePicture;