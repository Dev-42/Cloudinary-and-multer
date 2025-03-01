const multer = require("multer");
const path = require("path");

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
module.exports = upload;
