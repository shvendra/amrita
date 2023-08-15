const express = require("express");
const router = express.Router();
const {
  addSlider,
  getAllSlider,
  getSliderById,
  updateSlider,
  deleteSlider,
  updatedStatus,
  getAllSliderwebsiteactive,
} = require("../controller/sliderController");


//add a slider
router.post("/add", addSlider);

//get all slider
router.get("/", getAllSlider);
//get all active slider
router.get("/active", getAllSliderwebsiteactive);

//get a slider
router.post("/:id", getSliderById);

//update a slider
router.put("/:id", updateSlider);

//update slder status
router.put("/update-status/:id", updatedStatus);

//delete a staff
router.delete("/:id", deleteSlider);

module.exports = router;
