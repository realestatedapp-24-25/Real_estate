import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPackage, FiCalendar, FiMapPin, FiDollarSign, FiHome, FiUser, FiPhone, FiMail, FiShoppingBag } from 'react-icons/fi';

const MyDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await axios.get('/api/v1/donors/my-donations', {
                withCredentials: true
            });
            setDonations(response.data.data.donations);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch donations';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!donations.length) {
        return (
            <div className="text-center py-8 text-gray-600">
                <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-lg">No donations found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">My Donations</h2>
            <div className="grid gap-6 lg:grid-cols-2">
                {donations.map((donation) => (
                    <div
                        key={donation._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gray-50 p-4 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <FiHome className="text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {donation.institute.institute_name}
                                    </h3>
                                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                        {donation.institute.institute_type}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    donation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {/* Institute Details */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <FiUser className="text-gray-400" />
                                    <span>Contact Person: {donation.institute.user.name}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <FiMail className="text-gray-400" />
                                    <span>{donation.institute.user.email}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <div className="flex items-start space-x-2">
                                        <FiMapPin className="text-gray-400 mt-1" />
                                        <span>
                                            {donation.institute.user.address.street}, {donation.institute.user.address.city},
                                            <br />
                                            {donation.institute.user.address.state} - {donation.institute.user.address.pincode}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Shop Details */}
                            <div className="border-t pt-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FiShoppingBag className="text-gray-400" />
                                    <span className="font-medium">{donation.shop.shopName}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600 ml-6">
                                    <div className="flex items-center space-x-2">
                                        <FiPhone className="text-gray-400" />
                                        <span>{donation.shop.contactInfo.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FiMail className="text-gray-400" />
                                        <span>{donation.shop.contactInfo.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="border-t pt-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FiPackage className="text-gray-400" />
                                    <span className="font-medium">Donated Items</span>
                                </div>
                                <ul className="ml-6 space-y-1">
                                    {donation.items.map((item, index) => (
                                        <li key={index} className="text-gray-600">
                                            {item.name} - {item.quantity} {item.unit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer */}
                            <div className="border-t pt-4 flex justify-between items-center text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <FiCalendar className="text-gray-400" />
                                    <span>{new Date(donation.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                                <div className="flex items-center space-x-2 font-medium">
                                    <FiDollarSign className="text-gray-400" />
                                    <span>₹{donation.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyDonations;