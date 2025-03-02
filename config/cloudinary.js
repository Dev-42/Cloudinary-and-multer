const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ FIXED
  });
};
const cloudinaryUpload = async (filePath) => {
  try {
    cloudinaryConfig();
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "upload",
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { cloudinaryUpload };
