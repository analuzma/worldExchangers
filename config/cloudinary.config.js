//imports
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//config storage
const storage = new CloudinaryStorage({
  //pasamos configuracion
  cloudinary,
  params: {
    folder: "edit-user-project",
    allowed_formats: ["jpg", "png", "gif", "svg", "webp"],
  },
});

module.exports = multer({ storage });
