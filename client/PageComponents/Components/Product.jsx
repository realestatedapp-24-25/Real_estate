import React, { useState, useEffect } from "react";
import axios from "axios"; // For fetching data from the server

const Product = () => {
  const [properties, setProperties] = useState([]); // Store all properties
  const [filteredProperties, setFilteredProperties] = useState([]); // Store filtered properties
  const [selectedCategory, setSelectedCategory] = useState("*"); // Store selected category
  const [selectedProperty, setSelectedProperty] = useState(null); // Track selected row

  // Fetch properties from the backend API when the component is mounted
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/property/properties?category=${
          selectedCategory === "*" ? "" : selectedCategory
        }`
      )
      .then((response) => {
        setProperties(response.data);
        setFilteredProperties(response.data); // Initially show all properties
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, [selectedCategory]); // Re-fetch when the category changes

  // Filter properties based on selected category
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category); // Set the selected category
    setSelectedProperty(null); // Reset selection on category change
  };

  // Inline CSS styles for table
  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyles = {
    padding: "10px",
    textAlign: "left",
    border: "1px solid #ddd",
  };

  const thStyles = {
    backgroundColor: "#f7f7f7",
    color: "#333",
  };

  const tdStyles = {
    backgroundColor: "#fff",
  };

  const trHoverStyles = {
    backgroundColor: "#f1f1f1",
  };

  return (
    <div className="rn-product-area rn-section-gapTop masonary-wrapper-activation">
      <div className="container">
        <div className="row align-items-center mb--30">
          <div className="col-lg-4">
            <div className="section-title">
              <h3 className="title mb--0">Explore Product</h3>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="button-group isotop-filter filters-button-group d-flex justify-content-start justify-content-lg-end mt_md--30 mt_sm--30">
              <button
                onClick={() => handleCategoryFilter("*")}
                className={selectedCategory === "*" ? "is-checked" : ""}
              >
                <span className="filter-text">All</span>
              </button>
              <button
                onClick={() => handleCategoryFilter("Housing")}
                className={selectedCategory === "Housing" ? "is-checked" : ""}
              >
                <span className="filter-text">Housing</span>
              </button>
              <button
                onClick={() => handleCategoryFilter("Office")}
                className={selectedCategory === "Office" ? "is-checked" : ""}
              >
                <span className="filter-text">Office</span>
              </button>
              <button
                onClick={() => handleCategoryFilter("Rental")}
                className={selectedCategory === "Rental" ? "is-checked" : ""}
              >
                <span className="filter-text">Rental</span>
              </button>
              <button
                onClick={() => handleCategoryFilter("Farmhouse")}
                className={selectedCategory === "Farmhouse" ? "is-checked" : ""}
              >
                <span className="filter-text">Farmhouse</span>
              </button>
              <button
                onClick={() => handleCategoryFilter("Country")}
                className={selectedCategory === "Country" ? "is-checked" : ""}
              >
                <span className="filter-text">Country</span>
              </button>
              <button
                onClick={() => handleCategoryFilter("Commercial")}
                className={
                  selectedCategory === "Commercial" ? "is-checked" : ""
                }
              >
                <span className="filter-text">Commercial</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table for displaying properties */}
        <div className="property-table">
          <table className="w-full border border-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="px-6 py-3 border-b border-white">Name</th>
                <th className="px-6 py-3 border-b border-white">Size</th>
                <th className="px-6 py-3 border-b border-white">Location</th>
                <th className="px-6 py-3 border-b border-white">Amenities</th>
                <th className="px-6 py-3 border-b border-white">Category</th>
              </tr>
            </thead>
            <tbody>
              {properties.length > 0 ? (
                properties.map((property) => (
                  <tr
                    key={property._id}
                    onClick={() => setSelectedProperty(property._id)} // Track clicked row
                    className={`cursor-pointer transition-all ${
                      selectedProperty === property._id
                        ? "bg-blue-600 text-white"
                        : "odd:bg-gray-100 even:bg-white hover:bg-blue-50"
                    }`}
                  >
                    <td className="px-6 py-4 border-b border-white">
                      {property.name}
                    </td>
                    <td className="px-6 py-4 border-b border-white">
                      {property.size}
                    </td>
                    <td className="px-6 py-4 border-b border-white">
                      {property.location}
                    </td>
                    <td className="px-6 py-4 border-b border-white">
                      {property.amenities.join(", ")}
                    </td>
                    <td className="px-6 py-4 border-b border-white">
                      {property.category}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Product;
