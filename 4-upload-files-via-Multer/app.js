const express = require("express");
const app = express();
const port = 3100;

const path = require("path");
const multer = require("multer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const fs = require("fs");

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "_");
    cb(null, `${name}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/zip", "application/x-zip-compressed"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("only zip files"), false);
  }
};

const limits = {
  fileSize: 512 * 1024,
};

const upload = multer({ storage, fileFilter, limits });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.post("/upload-file", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.message === "only zip files") {
        return res.status(400).send("only zip files");
      }

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("The file is too large");
      }
      return res.status(500).send("upload error");
    }

    res.send("the file was uploaded successfully");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
