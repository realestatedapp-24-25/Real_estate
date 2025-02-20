const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    accountAddress: { type: String },
    arModelUrl: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Property", PropertySchema);
