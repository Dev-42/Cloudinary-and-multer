const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { cloudinaryUpload } = require("../config/cloudinary");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname); // 🏷️ Get file extension (.pdf, .png, etc.)
    const fileName = path
      .basename(file.originalname, fileExt)
      .replace(/\s+/g, "_"); // 📝 Remove spaces in original filename
    cb(null, `${Date.now()}-${fileName}${fileExt}`); // ✅ Corrected format
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); //Accept the file
  } else {
    cb(
      new Error(
        "Only images in the format of jpeg and png and pdf files are allowed"
      )
    );
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const filePath = req.file.path;
    const result = await cloudinaryUpload(filePath);
    fs.unlinkSync(filePath);
    req.cloudinaryFile = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
};
module.exports = { upload, uploadToCloudinary };
