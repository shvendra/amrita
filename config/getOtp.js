require("dotenv").config();
const {  sendEmail } = require("../lib/email-sender/sender");

const getEmailOtp = (user) => {
    try {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const body = {
          from: process.env.EMAIL_USER,
          to: `${user.email}`,  
          subject: "Verify Login Email OTP",
          html: `<h2>Hello User,</h2>
          <p>OTP has been received to verify the email for your <strong>Amrita Vishwa Vidyapeetham</strong> account </p>
            <a href=${'#'}  style="background:rgba(181,29,72,255);color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">${rand} </a>
            <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@email.com</p>
            <p style="margin-bottom:0px;">Thank you</p>
            <strong>Team Amrita Vishwa Vidyapeetham</strong>`,
        };
        const message = "Please check your email to reset password!";
        sendEmail(body, '', message);
        return rand;
      } catch (error) {
        return error;
      }
}
module.exports = {
    getEmailOtp,
  };