const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

router.get("/allproperty", async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filters = {};

    if (category) {
      filters.category = category;
    }
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

router.post("/create", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json({ message: "Property stored successfully" });
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
