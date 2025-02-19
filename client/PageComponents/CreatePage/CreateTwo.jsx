import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

// INTERNAL IMPORT
import { Loader, GlobalLoder } from "../Components";
import { CreateThree } from ".";
import { useStateContext } from "../../context";

const categories = [
  "Housing",
  "Rental",
  "Farmhouse",
  "Office",
  "Commercial",
  "Country",
];

const CreateTwo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [file, setFile] = useState(null);
  const [displayImg, setDisplayImg] = useState(null);
  const [fileName, setFileName] = useState("Upload Image");
  const [propertyID, setPropertyID] = useState("");
  const [isVerified, setIsVerified] = useState(false); // Default to false
  const [coverFile, setCoverFile] = useState(null);
  const [featuredFile, setFeaturedFile] = useState(null);

  const {
    currentAccount,
    createPropertyFunction,
    PINATA_API_KEY,
    PINATA_SECRECT_KEY,
    loader,
    setLoader,
    notifySuccess,
    notifyError,
  } = useStateContext();

  const [form, setForm] = useState({
    propertyTitle: "",
    description: "",
    category: "",
    price: "",
    images: "",
    propertyAddress: "",
    coverImage: "",
    featuredImage: "",
  });

  const handleFormFieldChange = (fileName, e) => {
    setForm({ ...form, [fileName]: e.target.value });
  };

  // Verify Property ID
  const verifyPropertyID = async () => {
    try {
      const response = await axios.get("/validPropertyIDs.json");
      const validProperties = response.data.propertyIDs;
  
      // Check if Property ID exists
      if (!validProperties[propertyID]) {
        notifyError("Invalid Property ID!");
        setIsVerified(false);
        return false;
      }
  
      const expectedDetails = validProperties[propertyID];
      const { landSize, propertyType } = expectedDetails;
  
      // Check if description includes correct details
      const descriptionText = form.description.toLowerCase();
      const landSizeMatch = descriptionText.includes(landSize.toLowerCase());
      const typeMatch = descriptionText.includes(propertyType.toLowerCase());
  
      if (!landSizeMatch || !typeMatch) {
        notifyError(`Description must mention Landsize and PropertyType".`);
        setIsVerified(false);
        return false;
      }
  
      notifySuccess("Property ID & Description Verified!");
      setIsVerified(true);
      return true;
    } catch (error) {
      console.error("Error verifying property:", error);
      notifyError("Error verifying property. Try again.");
      setIsVerified(false);
      return false;
    }
  };
  

  const handleSubmit = async () => {

    if (!isVerified) {
      notifyError("Property ID is not verified. Cannot proceed.");
      return;
    }
    setIsLoading(true);
  
    const {
      propertyTitle,
      description,
      category,
      price,
      images,
      propertyAddress,
      coverImage,
      featuredImage,
    } = form;
  
    if (!propertyTitle || !price || !category || !description || !propertyAddress) {
      notifyError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
  
    try {
      // **STEP 1: Initiate MetaMask Transaction**
      console.log("🔹 Starting MetaMask transaction...");
      const transaction = await createPropertyFunction({
        ...form,
        price: ethers.utils.parseUnits(form.price, 18),
      });
  
      console.log("✅ MetaMask Transaction:", transaction);
  
      if (transaction) {
        notifyError("MetaMask transaction failed. Property not created.");
        setIsLoading(false);
        return;
      }
  
      // **STEP 2: Prepare Data for MongoDB**
      const propertyData = {
        accountAddress: currentAccount, // MetaMask Address
        propertyTitle,
        description,
        category,
        price: ethers.utils.parseUnits(price, "18").toString(), // Convert price
        images,
        propertyAddress,
        coverImage,
        featuredImage,
      };
  
      console.log("📌 Sending data to MongoDB:", propertyData);
  
      // **STEP 3: Store Data in MongoDB**
      const response = await axios.post("http://localhost:5000/api/property/create", propertyData);
  
      console.log("✅ MongoDB Response:", response.data);
  
      if (response.status === 201) {
        notifySuccess("Property stored successfully in MongoDB.");
      } else {
        notifyError("Failed to store property in MongoDB. Try again.");
        console.error("❌ MongoDB Error:", response);
      }
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      notifyError("Something went wrong. Check console.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const uploadToPinata = async () => {
    setLoader(true);
    setFileName("Image Uploading...");
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRECT_KEY,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        setForm({ ...form, images: ImgHash });
        notifySuccess("Successfully uploaded");
        setFileName("Image Uploaded");
        setLoader(false);
        return ImgHash;
      } catch (error) {
        setLoader(false);
        notifyError("Unable to upload image to Pinata, Check API Key");
      }
    }
  };

  const retrieveFile = (event) => {
    const data = event.target.files[0];

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(event.target.files[0]);

      if (event.target.files && event.target.files[0]) {
        setDisplayImg(URL.createObjectURL(event.target.files[0]));
      }
    };

    event.preventDefault();
  };

  // Handle Cover Image Upload
  const handleCoverFile = (event) => {
    const data = event.target.files[0];
    setCoverFile(data);
  };

  // Handle Featured Image Upload
  const handleFeaturedFile = (event) => {
    const data = event.target.files[0];
    setFeaturedFile(data);
  };

  return (
    <>
      <div className="creat-collection-area pt--80">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-3 offset-1 ml_md--0 ml_sm--0">
              {/* Property Image Section */}
              <div className="collection-single-wized banner">
                <label className="title required">Property image</label>
                <div className="create-collection-input logo-image">
                  <div className="logo-c-image logo">
                    <img
                      id="rbtinput1"
                      src={displayImg || "/profile/profile-01.jpg"}
                      alt="Profile-NFT"
                    />
                    <label htmlFor="fatima" title="No File Choosen">
                      <span className="text-center color-white">
                        <i className="feather-edit"></i>
                      </span>
                    </label>
                  </div>
                  <div className="button-area">
                    <div className="brows-file-wrapper">
                      <input
                        name="fatima"
                        id="fatima"
                        type="file"
                        onChange={retrieveFile}
                      />
                    </div>
                  </div>
                </div>
                {file && (
                  <a
                    onClick={() => uploadToPinata()}
                    className="btn btn-primary-alta btn-large"
                  >
                    {fileName}
                  </a>
                )}
              </div>

              {/* Cover Image Section */}
              <div className="collection-single-wized banner">
                <label className="title">Cover Image</label>
                <div className="create-collection-input feature-image">
                  <div className="logo-c-image feature">
                    <img
                      id="rbtinput2"
                      src="/profile/cover-04.png"
                      alt="Profile-NFT"
                    />
                    <label htmlFor="nipa" title="No File Choosen">
                      <span className="text-center color-white">
                        <i className="feather-edit"></i>
                      </span>
                    </label>
                  </div>
                  <div className="button-area">
                    <div className="brows-file-wrapper">
                      <input
                        name="nipa"
                        id="nipa"
                        type="file"
                        onChange={handleCoverFile}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image Section */}
              <div className="collection-single-wized banner">
                <label className="title">Featured image</label>
                <div className="create-collection-input feature-image">
                  <div className="logo-c-image feature">
                    <img
                      id="createfileImage"
                      src="/profile/cover-03.jpg"
                      alt="Profile-NFT"
                    />
                    <label htmlFor="createinputfile" title="No File Choosen">
                      <span className="text-center color-white">
                        <i className="feather-edit"></i>
                      </span>
                    </label>
                  </div>
                  <div className="button-area">
                    <div className="brows-file-wrapper">
                      <input
                        name="createinputfile"
                        id="createinputfile"
                        type="file"
                        onChange={handleFeaturedFile}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="create-collection-form-wrapper">
                <div className="row">
                  {/* Property ID Verification */}
                  <div className="col-lg-6">
                    <div className="collection-single-wized">
                      <label htmlFor="propertyID" className="title required">
                        Property ID (Verification Required)
                      </label>
                      <div className="create-collection-input">
                        <input
                          id="propertyID"
                          className="name"
                          type="text"
                          value={propertyID}
                          onChange={(e) => setPropertyID(e.target.value)}
                          placeholder="Enter Property ID"
                        />
                        
                      </div>
                    </div>
                  </div>

                  {/* Property Title */}
                  <div className="col-lg-6">
                    <div className="collection-single-wized">
                      <label htmlFor="name" className="title required">
                        Property Title
                      </label>
                      <div className="create-collection-input">
                        <input
                          id="name"
                          className="name"
                          type="text"
                          required
                          placeholder="propertyTitle"
                          onChange={(e) =>
                            handleFormFieldChange("propertyTitle", e)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Category */}
                  <div className="col-lg-12">
                    <div className="collection-single-wized">
                      <label className="title">Category</label>
                      <div className="create-collection-input">
                        <div className="nice-select mb--30" tabIndex="0">
                          <span className="current">Add Category</span>
                          <ul className="list">
                            {categories.map((el, i) => (
                              <li
                                key={i + 1}
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    category: el,
                                  })
                                }
                                className="option"
                              >
                                {el}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-lg-12">
                    <div className="collection-single-wized">
                      <label htmlFor="description" className="title">Details : size*, propertyType*, location, features, amenities, and any special offers.</label>
                      <div className="create-collection-input">
                        <textarea
                          id="description"
                          className="text-area"
                          placeholder="Enter details about the property"
                          value={form.description}
                          onChange={(e) => handleFormFieldChange("description", e)}
                          // onBlur={verifyPropertyID}  // Validate onBlur
                        ></textarea>
                        <button onClick={verifyPropertyID}>Verify Property Legally </button>
                        {isVerified === false && (
                          <p style={{ color: "red" }}>Invalid Property ID!</p>
                        )}
                        {isVerified === true && (
                          <p style={{ color: "green" }}>Property ID Verified!</p>
                        )}
                      </div>
                    </div>
                  </div>


                  {/* Price */}
                  <div className="col-lg-6">
                    <div className="collection-single-wized">
                      <label htmlFor="earning" className="title">
                        Price
                      </label>
                      <div className="create-collection-input">
                        <input
                          id="earning"
                          className="url"
                          type="number"
                          placeholder="price"
                          onChange={(e) => handleFormFieldChange("price", e)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Address */}
                  <div className="col-lg-6">
                    <div className="collection-single-wized">
                      <label htmlFor="wallet" className="title">
                        Property Address
                      </label>
                      <div className="create-collection-input">
                        <input
                          id="wallet"
                          className="url"
                          type="text"
                          placeholder="propertyAddress"
                          onChange={(e) =>
                            handleFormFieldChange("propertyAddress", e)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-lg-12">
                    <div className="button-wrapper">
                      <a
                        onClick={() => handleSubmit()}
                        className="btn btn-primary-alta btn-large"
                        disabled={!isVerified} // Button disabled if Property ID is not verified
                      >
                        {isLoading ? <Loader /> : "Create Property"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateThree data={form} />
      {loader && <GlobalLoder />}
    </>
  );
};

export default CreateTwo;
