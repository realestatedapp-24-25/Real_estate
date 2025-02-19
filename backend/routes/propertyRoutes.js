const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// Create Property
router.post("/create", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json({ message: "Property stored successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Properties by Account Address
router.get("/:accountAddress", async (req, res) => {
  try {
    const properties = await Property.find({ accountAddress: req.params.accountAddress });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
