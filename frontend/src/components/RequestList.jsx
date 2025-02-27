import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPackage, FiClock, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'fulfilled'
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/v1/requests', {
        withCredentials: true
      });
      console.log('Requests:', response.data.data.requests); // For debugging
      setRequests(response.data.data.requests);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching requests:', err);
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

  const getInstituteTypeIcon = (type) => {
    switch (type) {
      case 'ORPHANAGE':
        return '👶';
      case 'ELDERLY_HOME':
        return '👴';
      case 'FOOD_PROVIDER':
        return '🍲';
      default:
        return '🏢';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-mycol-nyanza via-white to-mycol-celadon-2">
      {/* Hero Section */}
      <div className="bg-mycol-brunswick_green text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Donation Requests</h1>
          <p className="text-xl">Support institutes in need by fulfilling their requests</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-mycol-mint text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-mycol-mint text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('fulfilled')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'fulfilled'
                ? 'bg-mycol-mint text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Fulfilled
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mycol-mint"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Institute Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getInstituteTypeIcon(request.institute?.institute_type)}
                        </span>
                        <h3 className="text-lg font-semibold text-mycol-brunswick_green">
                          {request.institute?.institute_name || 'Unknown Institute'}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {request.institute?.institute_type?.replace('_', ' ')}
                      </p>
                    </div>
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

                  {/* Request Details */}
                  <div className="space-y-4">
                    {/* Items */}
                    <div className="flex items-start">
                      <FiPackage className="mt-1 mr-2 text-mycol-mint" />
                      <div>
                        <p className="font-medium text-gray-700">Requested Items:</p>
                        <ul className="mt-1 space-y-1">
                          {request.items.map((item, index) => (
                            <li key={index} className="text-gray-600 flex items-center gap-2">
                              <span>•</span>
                              <span>
                                {item.name} - {item.quantity} {item.unit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-gray-600">
                      <FiClock className="mr-2 text-mycol-mint" />
                      <span>Requested on: {formatDate(request.createdAt)}</span>
                    </div>

                    {/* Location */}
                    {request.institute?.geolocation && (
                      <div className="flex items-center text-gray-600">
                        <FiMapPin className="mr-2 text-mycol-mint" />
                        <span>Location available</span>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => navigate(`/requests/${request._id}`)}
                        className="px-4 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg">No requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList; 