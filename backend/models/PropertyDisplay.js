const mongoose = require("mongoose");

const PropertyDisplaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PropertyDisplay = mongoose.model(
  "PropertyDisplay",
  PropertyDisplaySchema
);

module.exports = PropertyDisplay;
