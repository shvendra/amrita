require("dotenv").config();
const {  sendEmail } = require("../../18sports-ecommerce-backend/lib/email-sender/sender");

const getEmailOtp = (user) => {
    try {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const body = {
          from: process.env.EMAIL_USER,
          to: `${user.email}`,
          subject: "Verify Email",
          html: `<h2>Hello ${user.name}</h2>
          <p>OTP has been received to verify the email for your <strong>18 Sports Ventures</strong> account </p>
            <a href=${'#'}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">${rand} </a>
            <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@18 Sports Ventures.com</p>
            <p style="margin-bottom:0px;">Thank you</p>
            <strong>18 Sports Ventures Team</strong>`,
        };
        const message = "Please check your email to reset password!";
        sendEmail(body, '', message);
        return rand;
      } catch (error) {
        console.log(error);
        return error;
      }
}
const getSmsOtp = (user) => {
    try {
      // console.log(user);
    var unirest = require("unirest");
    var phone = user.phone;
    const rand = Math.floor(1000 + Math.random() * 9000);
      var req = unirest("GET", process.env.SMS_API_URL);
      req.query({
        "authorization": process.env.SMS_API_AUTHORIZATION,
        "variables_values": rand,
        "route": "otp",
        "numbers": phone
      });
      req.headers({
        "cache-control": "no-cache"
      });
      req.end() 
      return rand;
    
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
module.exports = {
    getEmailOtp,
    getSmsOtp
  };