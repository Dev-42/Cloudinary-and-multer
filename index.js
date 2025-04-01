const express = require("express");
const {
  upload,
  uploadToCloudinary,
} = require("./middleware/fileupload.middleware");
require("dotenv").config();

const PORT = 3000;
const app = express();

app.post(
  "/upload",
  upload.array("files", 2),
  uploadToCloudinary,
  (req, res) => {
    if (!req.cloudinaryFiles || req.cloudinaryFiles.length === 0) {
      res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({
      message: "Files uploaded successfully",
      // cloudinary_url: req.cloudinaryFile.url,
      // cloudinary_id: req.cloudinaryFile.public_id,
      files: req.cloudinaryFiles,
    });
  }
);
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
