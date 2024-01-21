const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const fs = require('fs');
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const { signInToken, tokenForVerify } = require("../config/auth");
const { getEmailOtp } = require("../config/getOtp");
const {  sendEmail } = require("../lib/email-sender/sender");
const Admin = require("../models/Admin");
const Document = require("../models/Document");


const registerAdmin = async (req, res) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      });

      const staff = await newStaff.save();
      const token = signInToken(staff);
      res.send({
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
    // console.log(admin);
      if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
        // console.log('ffff')
        const otp = await getEmailOtp(req.body);
        const token = signInToken(admin);
        res.send({
          token,
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          otp: otp,
          message: "Success",
        });
      } else {
        res.status(401).send({
          message: "Invalid Email or password!",
        });
      }
  } else {
    res.status(401).send({
      message: "Email not found!",
    });
  }
    
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Admin.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
    return res.status(404).send({
      message: "User Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: `<h2>Hello ${req.body.verifyEmail}</h2>
      <p>A request has been received to change the password for your <strong>Amrita vishwa vidyapeetham</strong> account </p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${process.env.ADMIN_URL}/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>

        
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@18 Sports Ventures.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Amrita vishwa vidyapeetham Team</strong>
             `,
    };
    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const staff = await Admin.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        staff.password = bcrypt.hashSync(req.body.newPassword);
        staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};



const upload = async (req, res) => {
  try {
    const files = req.files;
var count = 0;
  // Process and store the files as required
  // For example, save the files to a specific directory using fs module
  files.forEach((file) => {
    count++;
    const filePath = `public/${file.filename}`;
    fs.rename(file.path, filePath, async(err) => {
      if (err) {
        // Handle error appropriately and send an error response
        return res.status(500).json({ error: 'Failed to store the file' });
      } else {
        const newDoc = new Document({
          dname: file.filename,
          branch: req.body.branch,
          docstatus: req.body.docstatus,
          uploadedByName: req.body.uploadedByName,
          uploadedBy: req.body.uploadedBy,
          semester: req.body.semester,
        });
  
        const doc = await newDoc.save();
      }
    });
  });
  // Send an appropriate response to the client
  if(count > 0) {
    console.log('in controllersuccess')

    res.status(200).json({ message: 'File upload successful' });
  }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};




const getAllDocuments = async (req, res) => {
  try {
    const document = await Document.find({}).sort({ _id: -1 });
    res.send(document);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const getAllDocumentsStudent = async (req, res) => {
  try {
    const document = await Document.find({
      docstatus: { $eq: 'publish' }
   }).sort({ _id: -1 });
    res.send(document);
    console.log(document);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updatedStatus = async (req, res) => {
  try {
    var newStatus = req.body.docstatus;
    if(newStatus == 'publish') {
      console.log('if')
      newStatus = 'pending';
    } else {
      console.log('else')
      newStatus = 'publish';
    }
    const id = req.body._id;
    console.log(req.body._id)


    const data = await Document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          docstatus: newStatus,
        },
      }
    );
    // console.log(data);
    res.send({
      message: `Document ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};


module.exports = {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  upload,
  getAllDocuments,
  updatedStatus,
  getAllDocumentsStudent
};
