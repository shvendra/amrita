const express = require("express");
const router = express.Router();

const multer = require("multer");

 //upload files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
     cb(null, file.originalname);
  }
  });
  const upload = multer({ storage });
  router.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
  return res.json({  message: 'Please upload a file' })
  }
  return res.json({  message: 'uploaded' })
  });   


module.exports = router;
