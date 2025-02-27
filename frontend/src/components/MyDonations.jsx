import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBox, FiClock, FiMapPin, FiShoppingBag, FiUser, FiMail, FiPhone } from 'react-icons/fi';

const MyDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                console.log('Fetching donations...');
                const response = await axios.get('/api/v1/donors/my-donations', {
                    withCredentials: true
                });
                
                console.log('Response:', response.data);
                
                if (response.data.status === 'success') {
                    setDonations(response.data.data.donations);
                } else {
                    setError('Failed to fetch donations');
                }
            } catch (err) {
                console.error('Error fetching donations:', err);
                setError(err.message || 'Failed to fetch donations');
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-mycol-nyanza via-white to-mycol-celadon-2">
                <div className="w-16 h-16 border-4 border-mycol-mint border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-mycol-sea_green text-lg">Loading your donations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-mycol-nyanza via-white to-mycol-celadon-2 p-6">
                <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md text-center">
                    <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h2>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-mycol-mint text-white px-4 py-2 rounded-lg hover:bg-mycol-mint-2 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-mycol-nyanza via-white to-mycol-celadon-2 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-mycol-brunswick_green mb-8">
                    My Donations
                </h1>

                {donations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
                        <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-4">You haven't made any donations yet.</p>
                        <button
                            onClick={() => window.location.href = '/donate'} // Replace with your donation page route
                            className="bg-mycol-mint text-white px-6 py-2 rounded-lg hover:bg-mycol-mint-2 transition-colors"
                        >
                            Make a Donation
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {donations.map(donation => (
                            <DonationCard key={donation._id} donation={donation} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const DonationCard = ({ donation }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-mycol-brunswick_green">
                        Donation to {donation.institute?.institute_name || 'Unknown Institute'}
                    </h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(donation.status)}`}>
                        {donation.status}
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-6">
                    {donation.institute && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-mycol-brunswick_green">Institute Details</h4>
                            <div className="flex items-center text-gray-700">
                                <FiUser className="mr-3 text-mycol-mint" />
                                <span>{donation.institute.institute_name}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FiMail className="mr-3 text-mycol-mint" />
                                <span>{donation.institute.user?.email || 'No email provided'}</span>
                            </div>
                            {donation.institute.user?.address && (
                                <div className="flex items-start text-gray-700">
                                    <FiMapPin className="mr-3 mt-1 text-mycol-mint" />
                                    <span>
                                        {donation.institute.user.address.street}, 
                                        {donation.institute.user.address.city}, 
                                        {donation.institute.user.address.state} - 
                                        {donation.institute.user.address.pincode}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {donation.shop && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-mycol-brunswick_green">Shop Details</h4>
                            <div className="flex items-center text-gray-700">
                                <FiShoppingBag className="mr-3 text-mycol-mint" />
                                <span>{donation.shop.shopName || 'Unknown Shop'}</span>
                            </div>
                            {donation.shop.contactInfo && (
                                <>
                                    <div className="flex items-center text-gray-700">
                                        <FiPhone className="mr-3 text-mycol-mint" />
                                        <span>{donation.shop.contactInfo.phone}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <FiMail className="mr-3 text-mycol-mint" />
                                        <span>{donation.shop.contactInfo.email}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {donation.items && donation.items.length > 0 && (
                    <div className="border-t pt-6">
                        <h4 className="text-lg font-semibold text-mycol-brunswick_green mb-4">Donated Items</h4>
                        <div className="space-y-4">
                            {donation.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <FiBox className="text-mycol-mint mr-3" />
                                        <div>
                                            <div className="font-medium text-gray-800">{item.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {item.quantity} {item.unit}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                    <div className="flex items-center text-gray-700">
                        <FiClock className="mr-3 text-mycol-mint" />
                        <span>{formatDate(donation.createdAt)}</span>
                    </div>
                    <div className="text-xl font-semibold text-mycol-brunswick_green">
                        Total: ₹{donation.totalAmount?.toFixed(2) || '0.00'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyDonations;