const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  accountAddress: String, // MetaMask Account Address
  propertyTitle: String,
  description: String,
  category: String,
  price: String,
  images: String,
  propertyAddress: String,
  coverImage: String,
  featuredImage: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Property", PropertySchema);
