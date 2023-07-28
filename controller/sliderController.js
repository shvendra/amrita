const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const { signInToken, tokenForVerify } = require("../config/auth");

const Slider = require("../models/Slider");


const addSlider = async (req, res) => {
  // console.log("add staf....", req.body.staffData);
  try {
      
    
      const newStaff = new Slider({
        heading: { ...req.body.sliderData.heading },
        description: req.body.sliderData.description,
        image: req.body.sliderData.image,
      });

      await newStaff.save();
      res.status(200).send({
        message: "Slider Added Successfully!",
      });
    
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};

const getAllSlider = async (req, res) => {
  // console.log('allamdin')
  try {
    const sliders = await Slider.find({}).sort({ _id: -1 });
    res.send(sliders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getSliderById = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    res.send(slider);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findOne({ _id: req.params.id });
    // console.log('Updating staff from Master DB', admin);
    if (slider) {
      // Updating Master Record - CCDev
      slider.heading = { ...slider.heading, ...req.body.heading };
      slider.description = req.body.description;
      slider.image = req.body.image;
      const updatedSlider = await slider.save();
      const token = signInToken(updatedSlider);
      res.send({
        token,
        message: "Slider Updated Successfully!",
        _id: updatedSlider._id,
        heading: updatedSlider.heading,
        description: updatedSlider.description,
        image: updatedSlider.image,
      });
    } else {
      res.status(404).send({
        message: "This slider not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteSlider = (req, res) => {
  Slider.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Slider Deleted Successfully!",
      });
    }
  });
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Slider.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Slider ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addSlider,
  getAllSlider,
  getSliderById,
  updateSlider,
  deleteSlider,
  updatedStatus,
};
