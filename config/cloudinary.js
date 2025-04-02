const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();
const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ FIXED
  });
};

const generateTimeStamp = () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  // generate the signature string
  const signatureString = `folder=upload&timestamp=${timestamp}${api_secret}`;

  // generate a SHA1 hash for our signature
  const signature = crypto
    .createHash("sha1")
    .update(signatureString)
    .digest("hex");
  return { timestamp, signature };
};

const cloudinaryUpload = async (filePath) => {
  try {
    cloudinaryConfig();
    const { timestamp, signature } = generateTimeStamp();
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "upload",
      timestamp: timestamp,
      signature: signature,
      api_key: process.env.CLOUDINARY_API_KEY, // API Key is required
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { cloudinaryUpload };
