const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const { signInToken, tokenForVerify } = require("../config/auth");
const Query = require("../models/Query");
const {  sendEmail } = require("../../18sports-ecommerce-backend/lib/email-sender/sender");
const getAllQuery = async (req, res) => {
  try {
    const querys = await Query.find({}).sort({ _id: -1 });
    res.send(querys);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    res.send(query);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateQuery = async (req, res) => {
    try {
      const query = await Query.findOne({ _id: req.params.id });
      // console.log('Updating staff from Master DB', admin);
      if (query) {
        query.response = req.body.response;
        query.email = req.body.email;
        query.status = "Resolved";
        const updatedQuery = await query.save();
        const token = signInToken(updatedQuery);


        const body = {
          from: process.env.EMAIL_USER,
          to: `${req.body.email}`,
          subject: "Query Resolved 18Sports ventures",
          html: `<h2>Hello ${req.body.email}</h2>
          <p>This email is as response of your query from  <strong>18 Sports Ventures</strong> account </p>
    
    
            <p style="margin-bottom:20px;">${req.body.response}</p>

    
            
            <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@18 Sports Ventures.com</p>
    
            <p style="margin-bottom:0px;">Thank you</p>
            <strong>18 Sports Ventures Team</strong>
                 `,
        };
        const message = "Please check your email to see response of your query!";
        sendEmail(body, res, message);



        res.send({
          token,
          message: "Query Updated Successfully!",
          _id: updatedQuery._id,
          response: updatedQuery.response,
          resolved: updatedQuery.resolved,
        });
      } else {
        res.status(404).send({
          message: "This query not found!",
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  };

  
const deleteQuery = (req, res) => {
  Query.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Query Deleted Successfully!",
      });
    }
  });
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Query.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Query ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllQuery,
  getQueryById,
  deleteQuery,
  updateQuery,
  updatedStatus,
};
