const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { cloudinaryUpload } = require("../config/cloudinary");
const supabase = require("../config/supabase");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/"); //This upload will be our uploads folder
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
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const uploadedFiles = [];
    for (let file of req.files) {
      // Define format based on mimetype
      const isPng = file.mimetype === "image/png";
      const outputFormat = isPng ? "webp" : "jpeg";

      const resizedCompressedPath = `upload/processed-${Date.now()}-${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}.${outputFormat}`;

      try {
        // Resize, compress, and convert format
        await sharp(file.path)
          .resize({ width: 500 }) // Maintain aspect ratio
          .toFormat(outputFormat, {
            quality: 70, // Adjust quality (50–80 recommended)
          })
          .toFile(resizedCompressedPath);

        // Upload to Cloudinary
        const result = await cloudinaryUpload(resizedCompressedPath);

        // Cleanup local files
        fs.unlinkSync(file.path);
        fs.unlinkSync(resizedCompressedPath);

        uploadedFiles.push({
          url: result.secure_url,
          public_id: result.public_id,
        });

        await supabase.from("uploads").insert([
          {
            file_name: file.originalname,
            file_url: result.secure_url,
            cloudinary_id: result.public_id,
          },
        ]);
      } catch (err) {
        console.error("Error processing image:", err);
        return res.status(500).json({
          message: "Image processing failed",
          error: err.message,
        });
      }
    }
    req.cloudinaryFiles = uploadedFiles;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
};
module.exports = { upload, uploadToCloudinary };
