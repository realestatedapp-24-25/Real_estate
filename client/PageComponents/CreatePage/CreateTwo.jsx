// import React, { useState } from "react";
// import { ethers } from "ethers";
// import axios from "axios";

// import { Loader, GlobalLoder } from "../Components";
// import { CreateThree } from ".";
// import { useStateContext } from "../../context";
// import { checkIfImage } from "../../utils";

// const categories = [
//   "Housing",
//   "Rental",
//   "Farmhouse",
//   "Office",
//   "Commercial",
//   "Country",
// ];

// const CreateTwo = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [properties, setProperties] = useState([]);
//   const [file, setFile] = useState(null);
//   const [diplayImg, setDiplayImg] = useState(null);
//   const [fileName, setFileName] = useState("Upload Image");
//   const [arModelFile, setArModelFile] = useState(null);

//   const {
//     currentAccount,
//     createPropertyFunction,
//     PINATA_API_KEY,
//     PINATA_SECRECT_KEY,
//     loader,
//     setLoader,
//     notifySuccess,
//     notifyError,
//   } = useStateContext();

//   const [form, setForm] = useState({
//     propertyTitle: "",
//     description: "",
//     category: "",
//     price: "",
//     images: "",
//     propertyAddress: "",
//   });

//   const handleFormFieldChange = (fileName, e) => {
//     setForm({ ...form, [fileName]: e.target.value });
//   };

//   const handleArModelFileChange = (e) => {
//     const file = e.target.files[0];
//     setArModelFile(file);
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);

//     try {
//       const {
//         propertyTitle,
//         description,
//         category,
//         price,
//         images,
//         propertyAddress,
//       } = form;

//       await createPropertyFunction({
//         ...form,
//         price: ethers.utils.parseUnits(form.price, 18),
//       });

//       let arModelUrl = "";
//       if (arModelFile) {
//         const formData = new FormData();
//         formData.append("file", arModelFile);

//         const uploadResponse = await axios.post(
//           "http://127.0.0.1:5000/api/property/upload-ar-model",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         arModelUrl = uploadResponse.data.arModelUrl;
//       }

//       const postData = {
//         accountAddress: currentAccount,
//         propertyTitle,
//         description,
//         category,
//         price: form.price,
//         images,
//         propertyAddress,
//         arModelUrl,
//       };

//       const response = await axios.post(
//         "http://127.0.0.1:5000/api/property/create",
//         postData
//       );

//       if (response.status === 201) {
//         notifySuccess("Property saved to database successfully!");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       notifyError(error.response?.data?.error || "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const uploadToPinata = async () => {
//     setLoader(true);
//     setFileName("Image Uploading...");
//     if (file) {
//       try {
//         const formData = new FormData();
//         formData.append("file", file);

//         const response = await axios({
//           method: "post",
//           url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//           data: formData,
//           headers: {
//             pinata_api_key: PINATA_API_KEY,
//             pinata_secret_api_key: PINATA_SECRECT_KEY,
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

//         setForm({ ...form, images: ImgHash });
//         notifySuccess("Successfully uploaded");
//         setFileName("Image Uploaded");
//         setLoader(false);
//         return ImgHash;
//       } catch (error) {
//         setLoader(false);
//         notifyError("Unable to upload image to Pinata, Check API Key");
//       }
//     }
//   };

//   const retrieveFile = (event) => {
//     const data = event.target.files[0];

//     const reader = new window.FileReader();
//     reader.readAsArrayBuffer(data);

//     reader.onloadend = () => {
//       setFile(event.target.files[0]);

//       if (event.target.files && event.target.files[0]) {
//         setDiplayImg(URL.createObjectURL(event.target.files[0]));
//       }
//     };

//     event.preventDefault();
//   };

//   return (
//     <>
//       <div class="creat-collection-area pt--80">
//         <div class="container">
//           <div class="row g-5 ">
//             <div class="col-lg-3 offset-1 ml_md--0 ml_sm--0">
//               <div class="collection-single-wized banner">
//                 <label class="title required">Property image</label>

//                 <div class="create-collection-input logo-image">
//                   <div class="logo-c-image logo">
//                     <img
//                       id="rbtinput1"
//                       src={diplayImg || "/profile/profile-01.jpg"}
//                       alt="Profile-NFT"
//                     />
//                     <label for="fatima" title="No File Choosen">
//                       <span class="text-center color-white">
//                         <i class="feather-edit"></i>
//                       </span>
//                     </label>
//                   </div>
//                   <div class="button-area">
//                     <div class="brows-file-wrapper">
//                       <input
//                         name="fatima"
//                         id="fatima"
//                         type="file"
//                         onChange={retrieveFile}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {file && (
//                   <a
//                     onClick={() => uploadToPinata()}
//                     class="btn btn-primary-alta btn-large"
//                   >
//                     {fileName}
//                   </a>
//                 )}
//               </div>

//               <div class="collection-single-wized banner">
//                 <label class="title">AR Model</label>
//                 <div class="create-collection-input feature-image">
//                   <div class="logo-c-image feature">
//                     <label for="arModel" title="No File Choosen">
//                       <span class="text-center color-white">
//                         <i class="feather-edit"></i>
//                       </span>
//                     </label>
//                   </div>
//                   <div class="button-area">
//                     <div class="brows-file-wrapper">
//                       <input
//                         name="arModel"
//                         id="arModel"
//                         type="file"
//                         onChange={handleArModelFileChange}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div class="collection-single-wized banner">
//                 <label class="title">Cover Image</label>
//                 <div class="create-collection-input feature-image">
//                   <div class="logo-c-image feature">
//                     <img
//                       id="rbtinput2"
//                       src="/profile/cover-04.png"
//                       alt="Profile-NFT"
//                     />
//                     <label for="nipa" title="No File Choosen">
//                       <span class="text-center color-white">
//                         <i class="feather-edit"></i>
//                       </span>
//                     </label>
//                   </div>
//                   <div class="button-area">
//                     <div class="brows-file-wrapper">
//                       <input name="nipa" id="nipa" type="file" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div class="collection-single-wized banner">
//                 <label class="title">Featured image</label>
//                 <div class="create-collection-input feature-image">
//                   <div class="logo-c-image feature">
//                     <img
//                       id="createfileImage"
//                       src="/profile/cover-03.jpg"
//                       alt="Profile-NFT"
//                     />
//                     <label for="createinputfile" title="No File Choosen">
//                       <span class="text-center color-white">
//                         <i class="feather-edit"></i>
//                       </span>
//                     </label>
//                   </div>
//                   <div class="button-area">
//                     <div class="brows-file-wrapper">
//                       <input
//                         name="createinputfile"
//                         id="createinputfile"
//                         type="file"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div class="col-lg-7">
//               <div class="create-collection-form-wrapper">
//                 <div class="row">
//                   <div class="col-lg-6">
//                     <div class="collection-single-wized">
//                       <label for="name" class="title required">
//                         Property Title
//                       </label>
//                       <div class="create-collection-input">
//                         <input
//                           id="name"
//                           class="name"
//                           type="text"
//                           required
//                           placeholder="propertyTitle"
//                           onChange={(e) =>
//                             handleFormFieldChange("propertyTitle", e)
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div class="col-lg-12">
//                     <div class="collection-single-wized">
//                       <label class="title">Category</label>
//                       <div class="create-collection-input">
//                         <div class="nice-select mb--30" tabindex="0">
//                           <span class="current">Add Category</span>
//                           <ul class="list">
//                             {categories.map((el, i) => (
//                               <li
//                                 key={i + 1}
//                                 onClick={() =>
//                                   setForm({
//                                     ...form,
//                                     category: el,
//                                   })
//                                 }
//                                 data-value="Housing"
//                                 class="option"
//                               >
//                                 {el}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div class="col-lg-12">
//                     <div
//                       class="collection-single-wized"
//                       style={{ padding: "15px", borderRadius: "10px" }}
//                     >
//                       <label
//                         for="description"
//                         class="title"
//                         style={{ fontSize: "16px", fontWeight: "bold" }}
//                       >
//                         Property Description
//                       </label>
//                       <div class="create-collection-input">
//                         <textarea
//                           id="description"
//                           class="text-area"
//                           placeholder="Enter property details..."
//                           onChange={(e) =>
//                             handleFormFieldChange("description", e)
//                           }
//                           style={{
//                             width: "100%",
//                             height: "120px",
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #555",
//                             fontSize: "14px",
//                             resize: "vertical",
//                           }}
//                         ></textarea>
//                       </div>
//                       <div
//                         style={{
//                           padding: "12px",
//                           borderRadius: "8px",
//                           marginTop: "10px",
//                           border: "1px solid #333",
//                         }}
//                       >
//                         <p
//                           style={{
//                             marginBottom: "5px",
//                             fontWeight: "bold",
//                             fontSize: "14px",
//                           }}
//                         >
//                           Description Format:
//                         </p>
//                         <hr
//                           style={{
//                             margin: "10px 0",
//                             border: "0.5px solid #555",
//                           }}
//                         />
//                         <p
//                           style={{
//                             marginBottom: "5px",
//                             fontWeight: "bold",
//                             fontSize: "14px",
//                           }}
//                         >
//                           Details:
//                         </p>
//                         <p style={{ margin: "4px 0", fontSize: "13px" }}>
//                           <strong>📏 Area:</strong> <i>e.g., 1200 sqft</i>
//                         </p>
//                         <p style={{ margin: "4px 0", fontSize: "13px" }}>
//                           <strong>🏠 Property Type:</strong> e.g., Apartment,
//                           Villa, Commercial Space, etc.
//                         </p>
//                         <p style={{ margin: "4px 0", fontSize: "13px" }}>
//                           <strong>📄 Drive Link:</strong> Upload required
//                           documents (e.g., <i>7/12 document</i>) to Google Drive
//                           and provide the link.
//                         </p>
//                         <p style={{ margin: "4px 0", fontSize: "13px" }}>
//                           <strong>✨ Features:</strong> Mention key features
//                           such as furnished, parking space, etc.
//                         </p>
//                         <p style={{ margin: "4px 0", fontSize: "13px" }}>
//                           <strong>🏢 Amenities:</strong> Include facilities like
//                           gym, swimming pool, security, etc.
//                         </p>
//                         <p style={{ margin: "4px 0", fontSize: "13px" }}>
//                           <strong>🔥 Special Offers:</strong> Mention any
//                           discounts or unique selling points.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div class="col-lg-6">
//                     <div class="collection-single-wized">
//                       <label for="earning" class="title">
//                         Price
//                       </label>
//                       <div class="create-collection-input">
//                         <input
//                           id="earning"
//                           class="url"
//                           type="number"
//                           placeholder="price"
//                           onChange={(e) => handleFormFieldChange("price", e)}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div class="col-lg-6">
//                     <div class="collection-single-wized">
//                       <label for="wallet" class="title">
//                         Property Address
//                       </label>
//                       <div class="create-collection-input">
//                         <input
//                           id="wallet"
//                           class="url"
//                           type="text"
//                           placeholder="propertyAddress"
//                           onChange={(e) =>
//                             handleFormFieldChange("propertyAddress", e)
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div class="col-lg-12">
//                     <div class="nuron-information mb--30">
//                       <div class="single-notice-setting">
//                         <div class="input">
//                           <input
//                             type="checkbox"
//                             id="themeSwitch"
//                             name="theme-switch"
//                             class="theme-switch__input"
//                           />
//                           <label for="themeSwitch" class="theme-switch__label">
//                             <span></span>
//                           </label>
//                         </div>
//                         <div class="content-text">
//                           <p>Explicit & sensitive content</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div class="col-lg-12">
//                     <div class="button-wrapper">
//                       <a
//                         href="#"
//                         class="btn btn-primary btn-large mr--30"
//                         data-bs-toggle="modal"
//                         data-bs-target="#collectionModal"
//                       >
//                         Preview
//                       </a>
//                       <a
//                         onClick={() => handleSubmit()}
//                         class="btn btn-primary-alta btn-large"
//                       >
//                         {isLoading ? <Loader /> : "Create"}
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <CreateThree data={form} />
//       {loader && <GlobalLoder />}
//     </>
//   );
// };

// export default CreateTwo;
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

import { Loader, GlobalLoder } from "../Components";
import { CreateThree } from ".";
import { useStateContext } from "../../context";
import { checkIfImage } from "../../utils";

const categories = [
  "Housing",
  "Rental",
  "Farmhouse",
  "Office",
  "Commercial",
  "Country",
];

const ARModelViewer = ({ modelUrl }) => {
  useEffect(() => {
    // Load the model-viewer script dynamically
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js";
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="ar-model-container mt-5">
      <h3 className="mb-4">3D Property Model Preview</h3>
      <div
        className="model-viewer-wrapper"
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <model-viewer
          src={modelUrl}
          alt="3D property model"
          camera-controls
          auto-rotate
          ar
          style={{ width: "100%", height: "100%" }}
        ></model-viewer>
      </div>
      <div className="mt-3 mb-5">
        <p className="ar-instructions">
          <i className="feather-info mr-2"></i>
          Use AR view on mobile devices to see this property in your space
        </p>
      </div>
    </div>
  );
};

const CreateTwo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [file, setFile] = useState(null);
  const [diplayImg, setDiplayImg] = useState(null);
  const [fileName, setFileName] = useState("Upload Image");
  const [arModelFile, setArModelFile] = useState(null);
  const [showARModel, setShowARModel] = useState(true);

  const staticARModelUrl =
    "https://res.cloudinary.com/dbdhfb85q/image/upload/v1740032454/ar-models/xfypk0irwskwfec9luma.glb";

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
  });

  const handleFormFieldChange = (fileName, e) => {
    setForm({ ...form, [fileName]: e.target.value });
  };

  const handleArModelFileChange = (e) => {
    const file = e.target.files[0];
    setArModelFile(file);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const {
        propertyTitle,
        description,
        category,
        price,
        images,
        propertyAddress,
      } = form;

      await createPropertyFunction({
        ...form,
        price: ethers.utils.parseUnits(form.price, 18),
      });

      let arModelUrl = "";
      if (arModelFile) {
        const formData = new FormData();
        formData.append("file", arModelFile);

        const uploadResponse = await axios.post(
          "http://127.0.0.1:5000/api/property/upload-ar-model",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        arModelUrl = uploadResponse.data.arModelUrl;
      }

      const postData = {
        accountAddress: currentAccount,
        propertyTitle,
        description,
        category,
        price: form.price,
        images,
        propertyAddress,
        arModelUrl,
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/api/property/create",
        postData
      );

      if (response.status === 201) {
        notifySuccess("Property saved to database successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      notifyError(error.response?.data?.error || "Something went wrong");
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
        setDiplayImg(URL.createObjectURL(event.target.files[0]));
      }
    };

    event.preventDefault();
  };

  return (
    <>
      <div className="creat-collection-area pt--80">
        <div className="container">
          <div className="row g-5 ">
            <div className="col-lg-3 offset-1 ml_md--0 ml_sm--0">
              <div className="collection-single-wized banner">
                <label className="title required">Property image</label>

                <div className="create-collection-input logo-image">
                  <div className="logo-c-image logo">
                    <img
                      id="rbtinput1"
                      src={diplayImg || "/profile/profile-01.jpg"}
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

              <div className="collection-single-wized banner">
                <label className="title">AR Model</label>
                <div className="create-collection-input feature-image">
                  <div className="logo-c-image feature">
                    <label htmlFor="arModel" title="No File Choosen">
                      <span className="text-center color-white">
                        <i className="feather-edit"></i>
                      </span>
                    </label>
                  </div>
                  <div className="button-area">
                    <div className="brows-file-wrapper">
                      <input
                        name="arModel"
                        id="arModel"
                        type="file"
                        onChange={handleArModelFileChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                      <input name="nipa" id="nipa" type="file" />
                    </div>
                  </div>
                </div>
              </div>

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
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="create-collection-form-wrapper">
                <div className="row">
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
                                data-value="Housing"
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

                  <div className="col-lg-12">
                    <div
                      className="collection-single-wized"
                      style={{ padding: "15px", borderRadius: "10px" }}
                    >
                      <label
                        htmlFor="description"
                        className="title"
                        style={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        Property Description
                      </label>
                      <div className="create-collection-input">
                        <textarea
                          id="description"
                          className="text-area"
                          placeholder="Enter property details..."
                          onChange={(e) =>
                            handleFormFieldChange("description", e)
                          }
                          style={{
                            width: "100%",
                            height: "120px",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #555",
                            fontSize: "14px",
                            resize: "vertical",
                          }}
                        ></textarea>
                      </div>
                      <div
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          marginTop: "10px",
                          border: "1px solid #333",
                        }}
                      >
                        <p
                          style={{
                            marginBottom: "5px",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          Description Format:
                        </p>
                        <hr
                          style={{
                            margin: "10px 0",
                            border: "0.5px solid #555",
                          }}
                        />
                        <p
                          style={{
                            marginBottom: "5px",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          Details:
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "13px" }}>
                          <strong>📏 Area:</strong> <i>e.g., 1200 sqft</i>
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "13px" }}>
                          <strong>🏠 Property Type:</strong> e.g., Apartment,
                          Villa, Commercial Space, etc.
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "13px" }}>
                          <strong>📄 Drive Link:</strong> Upload required
                          documents (e.g., <i>7/12 document</i>) to Google Drive
                          and provide the link.
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "13px" }}>
                          <strong>✨ Features:</strong> Mention key features
                          such as furnished, parking space, etc.
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "13px" }}>
                          <strong>🏢 Amenities:</strong> Include facilities like
                          gym, swimming pool, security, etc.
                        </p>
                        <p style={{ margin: "4px 0", fontSize: "13px" }}>
                          <strong>🔥 Special Offers:</strong> Mention any
                          discounts or unique selling points.
                        </p>
                      </div>
                    </div>
                  </div>

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
                  <div className="col-lg-12">
                    <div className="nuron-information mb--30">
                      <div className="single-notice-setting">
                        <div className="input">
                          <input
                            type="checkbox"
                            id="themeSwitch"
                            name="theme-switch"
                            className="theme-switch__input"
                          />
                          <label
                            htmlFor="themeSwitch"
                            className="theme-switch__label"
                          >
                            <span></span>
                          </label>
                        </div>
                        <div className="content-text">
                          <p>Explicit & sensitive content</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="button-wrapper">
                      <a
                        href="#"
                        className="btn btn-primary btn-large mr--30"
                        data-bs-toggle="modal"
                        data-bs-target="#collectionModal"
                      >
                        Preview
                      </a>
                      <a
                        onClick={() => handleSubmit()}
                        className="btn btn-primary-alta btn-large"
                      >
                        {isLoading ? <Loader /> : "Create"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AR Model Display Section */}
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-12">
            <div className="section-title text-center">
              <h2>Property 3D Model</h2>
              <p>View this property in augmented reality</p>
            </div>
          </div>
          <div className="col-lg-10 offset-lg-1">
            {showARModel && <ARModelViewer modelUrl={staticARModelUrl} />}
          </div>
        </div>
      </div>

      <CreateThree data={form} />
      {loader && <GlobalLoder />}
    </>
  );
};

export default CreateTwo;
