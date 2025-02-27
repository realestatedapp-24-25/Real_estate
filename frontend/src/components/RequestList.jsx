import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPackage, FiClock, FiCheck } from 'react-icons/fi';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/v1/requests', {
        withCredentials: true
      });
      setRequests(response.data.data.requests);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mycol-nyanza via-white to-mycol-celadon-2">
      {/* Hero Section */}
      <div className="bg-mycol-brunswick_green text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Donation Requests</h1>
          <p className="text-xl">View and respond to requests from institutes in need</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mycol-mint"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-mycol-brunswick_green">
                        {request.institute?.name || 'Unknown Institute'}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FiPackage className="mt-1 mr-2 text-mycol-mint" />
                        <div>
                          <p className="font-medium text-gray-700">Requested Items:</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {request.items.map((item, index) => (
                              <li key={index}>
                                {item.name} - {item.quantity} units
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <FiClock className="mr-2 text-mycol-mint" />
                        <span>Requested on: {formatDate(request.createdAt)}</span>
                      </div>

                      {request.institute?.contactInfo && (
                        <div className="text-sm text-gray-600">
                          <p>Contact: {request.institute.contactInfo.email}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        className="px-4 py-2 bg-mycol-mint text-white rounded hover:bg-mycol-mint-2 transition-colors"
                        onClick={() => {/* Handle view details */}}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {requests.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-lg">No requests found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RequestList; 