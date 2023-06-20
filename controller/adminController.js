const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const { signInToken, tokenForVerify } = require("../config/auth");
const { getEmailOtp, getSmsOtp } = require("../config/getOtp");

const {  sendEmail } = require("../../18sports-ecommerce-backend/lib/email-sender/sender");

const Admin = require("../models/Admin");

const registerAdmin = async (req, res) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const emailotp = getEmailOtp(req.body);
      const smsotp = getSmsOtp(req.body);
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        emailotp: emailotp,
        smsotp: smsotp,
        role: req.body.role,
        status: 'Inactive',
        password: bcrypt.hashSync(req.body.password),
      });

      const staff = await newStaff.save();
      const token = signInToken(staff);
      res.send({
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        smsotp: staff.smsotp,
        emailotp: staff.emailotp,
        role: staff.role,
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
    console.log(admin);
    if (admin.status == 'Active') {
      if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
        console.log('ffff')
        const smsotp = await getSmsOtp(admin);

        const token = signInToken(admin);
        res.send({
          token,
          _id: admin._id,
          name: admin.name,
          phone: admin.phone,
          email: admin.email,
          image: admin.image,
          otp: smsotp
        });
      } else {
        res.status(401).send({
          message: "Invalid Email or password!",
        });
      }
    } else {
      res.status(401).send({
        message: "Admin authentication pending!",
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
      <p>A request has been received to change the password for your <strong>18 Sports Ventures</strong> account </p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${process.env.ADMIN_URL}/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>

        
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@18 Sports Ventures.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>18 Sports Ventures Team</strong>
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

const verifyOtp = async (req, res) => {
  const email = req.body.email;
  const smsotp = req.body.smsotp;
  const emailotp = req.body.emailotp;
  const staff = await Admin.findOne({ email: email });
  
        if (staff.smsotp!= smsotp) {
          return res.status(500).send({
            message: "Incorrect SMS OTP!",
          });
        }
        if (staff.emailotp!= emailotp) {
          return res.status(500).send({
            message: "Incorrect Email OTP!",
          });
        }
        if (staff.smsotp == smsotp && staff.emailotp == emailotp) {
          staff.veryfied = 'Veryfied';
        staff.save();
        return res.status(200).send({
          message: "OTP verified Successfully!",
        });
        }
};

const addStaff = async (req, res) => {
  // console.log("add staf....", req.body.staffData);
  try {
    const isAdded = await Admin.findOne({ email: req.body.staffData.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: { ...req.body.staffData.name },
        email: req.body.staffData.email,
        password: bcrypt.hashSync(req.body.staffData.password),
        phone: req.body.staffData.phone,
        joiningDate: req.body.staffData.joiningDate,
        role: req.body.staffData.role,
        image: req.body.staffData.image,
      });

      await newStaff.save();

    const token = tokenForVerify(newStaff);
    const body = {
      from: process.env.EMAIL_USER,
      to: `${newStaff.email}`,
      subject: "Password Reset",
      html: `<h2>Hello ${newStaff.email}</h2>
        <p>A request has been received to add you as ${
          newStaff.role === "Admin" ? "an" : "a"
        } <strong>${
          newStaff.role
      }</strong> in <span style="text-transform: capitalize;"><strong>${
        "18Sports Ventures"
      }</strong></span>  company. </p>
    
          <p style="margin-bottom:30px;">First reset your password by click on the below Reset Password button. After that, you can log in to the account by clicking on the below Login button.</p>
        <a href=${process.env.ADMIN_URL}/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>

        
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@18 Sports Ventures.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>18 Sports Ventures Team</strong>
             `,
    };
    const message = "Please check your!";
    sendEmail(body, '', message);

      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};

const getAllStaff = async (req, res) => {
  // console.log('allamdin')
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    res.send(admins);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    // console.log('Updating staff from Master DB', admin);
    if (admin) {
      // Updating Master Record - CCDev
      admin.name = { ...admin.name, ...req.body.name };
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.userstatus = req.body.userstatus;
      admin.userpin = req.body.userpin;
      admin.joiningData = req.body.joiningDate;
      admin.forcepwreset = false;
      admin.password =
        req.body.password !== undefined
          ? bcrypt.hashSync(req.body.password)
          : admin.password;
      // admin.password = bcrypt.compareSync(
      //   req.body.password,
      //   admin.password
      // )
      //   ? admin.password
      //   : bcrypt.hashSync(req.body.password);

      admin.image = req.body.image;
      const updatedAdmin = await admin.save();
      const token = signInToken(updatedAdmin);
      res.send({
        token,
        message: "User Updated Successfully!",
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        userid: updatedAdmin.userid,
        userpin: updatedAdmin.userpin,
        image: updatedAdmin.image,
      });
    } else {
      res.status(404).send({
        message: "This user not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteStaff = (req, res) => {
  Admin.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Admin Deleted Successfully!",
      });
    }
  });
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `User ${newStatus} Successfully!`,
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
  verifyOtp,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
};
