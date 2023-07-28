const express = require("express");
const router = express.Router();
const {
  getAllQuery,
  getQueryById,
  deleteQuery,
  updatedStatus,
  updateQuery,
} = require("../controller/queryController");

//get all query
router.get("/", getAllQuery);

//get a query
router.post("/:id", getQueryById);

//update query status
router.put("/update-status/:id", updatedStatus);
router.put("/:id", updateQuery);

//delete a query
router.delete("/:id", deleteQuery);

module.exports = router;
