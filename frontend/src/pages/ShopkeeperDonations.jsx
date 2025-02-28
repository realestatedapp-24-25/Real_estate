import React, { useState } from "react";
import { CheckCircle, MapPin } from "lucide-react";
import axios from "axios";

const ShopkeeperDonations = () => {
  const [code, setCode] = useState("");
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch your location. Please enable location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleConfirm = async () => {
    if (!code || !location) {
      alert("Please enter the code and fetch your location.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `/api/v1/shipping/verify-delivery/${code}`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      );

      if (response.status === 200) {
        setIsConfirmed(true);
        alert("Delivery confirmed successfully!");
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while confirming delivery."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <MapPin className="text-green-500" size={24} />
          Delivery Confirmation
        </h1>

        {/* Input Code */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Delivery Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your code"
          />
        </div>

        {/* Get Location Button */}
        <button
          onClick={handleGetLocation}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <MapPin size={18} />
          {location ? "Update My Location" : "Get My Location"}
        </button>

        {/* Display Location */}
        {location && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <MapPin className="text-gray-700" size={18} />
              Your Location
            </h2>
            <p className="text-gray-700">
              Latitude: {location.latitude}, Longitude: {location.longitude}
            </p>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={isLoading || !code || !location}
          className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            "Confirming..."
          ) : (
            <>
              <CheckCircle size={18} />
              Confirm Delivery
            </>
          )}
        </button>

        {/* Confirmation Message */}
        {isConfirmed && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg text-green-700 flex items-center gap-2">
            <CheckCircle className="text-green-700" size={18} />
            Delivery confirmed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperDonations;