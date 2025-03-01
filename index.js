const express = require("express");
const upload = require("./middleware/fileupload.middleware");

const PORT = 3000;
const app = express();

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
