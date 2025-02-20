const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dbdhfb85q",
  api_key: "776282839643964",
  api_secret: "IJ8wzROZlhwKUmiSyzuM7JzDGKY",
});

const uploadToCloudinary = async (filePath, folder = "ar-models") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

module.exports = { cloudinary, uploadToCloudinary };
