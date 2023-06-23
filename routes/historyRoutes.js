const express = require('express');
const router = express.Router();
const {
  addHistory,
  getAllHistory,
  addManyHistory
} = require('../controller/historyController');

//add a coupon
router.post('/add', addHistory);

//get all coupon
router.get('/', getAllHistory);
router.post('/update/many', addManyHistory);


module.exports = router;
