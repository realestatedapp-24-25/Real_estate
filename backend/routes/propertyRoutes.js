const express = require("express");
const router = express.Router();
const multer = require("multer");
const Property = require("../models/Property");
const { uploadToCloudinary } = require("../controllers/cloudinary");

const upload = multer({ dest: "uploads/" });

router.get("/allproperty", async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filters = {};

    if (category) filters.category = category;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = minPrice;
      if (maxPrice) filters.price.$lte = maxPrice;
    }

    const properties = await Property.find(filters);
    res.status(200).json({
      status: "success",
      results: properties.length,
      data: { properties },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/singleproperty/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const {
      propertyTitle,
      description,
      category,
      price,
      images,
      propertyAddress,
      accountAddress,
      arModelUrl,
    } = req.body;

    const newProperty = new Property({
      title: propertyTitle,
      description,
      price,
      category,
      accountAddress,
      propertyAddress,
      images,
      arModelUrl,
    });

    await newProperty.save();
    res
      .status(201)
      .json({ message: "Property stored successfully", data: newProperty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/upload-ar-model", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const arModelUrl = await uploadToCloudinary(filePath);
    res.status(200).json({ arModelUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:accountAddress", async (req, res) => {
  try {
    const properties = await Property.find({
      accountAddress: req.params.accountAddress,
    });
    res.status(200).json({
      status: "success",
      results: properties.length,
      data: { properties },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
