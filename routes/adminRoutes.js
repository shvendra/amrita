const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  upload,
  getAllDocuments,
  updatedStatus,
  getAllDocumentsStudent
} = require("../controller/adminController");
const { passwordVerificationLimit } = require("../lib/email-sender/sender");
const uploadMiddleware = require('../controller/uploadMiddleware');


//register a staff
router.post("/register", registerAdmin);

//login a admin
router.post("/login", loginAdmin);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//upload
router.post("/upload",uploadMiddleware, upload);

router.get("/documents", getAllDocuments);
router.put("/documentsstatus", updatedStatus);
router.get("/documentsstudent", getAllDocumentsStudent);





module.exports = router;
