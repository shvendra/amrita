const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const History = require("../models/History");
const addHistory = async (req, res) => {
  try {
    const newhistory = new History(req.body);
    await newhistory.save();
    res.send({ message: "Success!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const addManyHistory = async (req, res) => {
  try {
    console.log(req.body)
    await History.insertMany(req.body);
    res.status(200).send({
      message: "History Added successfully!",
    });

  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const getAllHistory = async (req, res) => {
  // console.log('coupe')
  try {
    const queryObject = {};
    const { status } = req.query;

    if (status) {
      queryObject.status = { $regex: `${status}`, $options: "i" };
    }
    const history = await History.find(queryObject).sort({ _id: -1 });
    // console.log('coups',coupons)
    res.send(history);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
    addHistory,
  getAllHistory,
  addManyHistory,
};
