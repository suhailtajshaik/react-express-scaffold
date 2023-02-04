"use strict";

const express = require("express");
const router = express.Router();
let config = require("../../config.js");
const StoreImagesSchema = require("../../db/models/storeImages");

// @route     GET http://localhost:3000/api/storeimages?pageLimit=10&pageNumber=1
// @desc      gets StoreImages with pagination
router.get("/storeimages", async (req, res) => {
  let { pageLimit, pageNumber } = req.query;

  try {
    const pageSize = parseInt(pageLimit) || 10;
    const page = parseInt(pageNumber) || 1;
    const skip = (page - 1) * pageSize;

    const count = await StoreImagesSchema.countDocuments({});
    const totalPages = Math.ceil(count / pageSize);
    const data = await StoreImagesSchema.find({}).skip(skip).limit(pageSize).exec();

    res.json({ pageNumber: page, pageLimit: pageSize, totalPages, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server error" });
  }
});


router.post("/storeimages", async (req, res) => {
  let { pageLimit, pageNumber } = req.query;

  try {
    const pageSize = parseInt(pageLimit) || 10;
    const page = parseInt(pageNumber) || 1;
    const skip = (page - 1) * pageSize;

    const count = await StoreImagesSchema.countDocuments({});
    const totalPages = Math.ceil(count / pageSize);
    const data = await StoreImagesSchema.find({}).skip(skip).limit(pageSize).exec();
    // Update the images here using the req.body object

    // const updatedImages = await StoreImagesSchema.save();

    // res.send({ images: updatedImages, totalPages });

    // res.json({ pageNumber: page, pageLimit: pageSize, totalPages, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

module.exports = router;
