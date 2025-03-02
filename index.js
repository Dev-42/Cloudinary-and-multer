const express = require("express");
const {
  upload,
  uploadToCloudinary,
} = require("./middleware/fileupload.middleware");
require("dotenv").config();

const PORT = 3000;
const app = express();

app.post("/upload", upload.single("file"), uploadToCloudinary, (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    cloudinary_url: req.cloudinaryFile.url,
    cloudinary_id: req.cloudinaryFile.public_id,
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
