import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMinus, FiPlus, FiArrowLeft, FiSend, FiBox, FiHome, FiPhone, FiMail } from 'react-icons/fi';

export default function DonationDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedShops, instituteId } = location.state || {};

    const [donations, setDonations] = useState(
        selectedShops?.map(shop => ({
            shopId: shop._id,
            shopName: shop.shopName,
            contactInfo: shop.contactInfo,
            address: shop.address,
            items: shop.inventory.map(item => ({
                itemName: item.itemName,
                name: item.itemName,
                quantity: 0,
                unit: item.unit,
                maxQuantity: item.quantity,
                pricePerUnit: item.pricePerUnit,
                category: item.category
            }))
        })) || []
    );

    const handleQuantityChange = (shopIndex, itemIndex, value) => {
        setDonations(prev => {
            const newDonations = [...prev];
            const item = newDonations[shopIndex].items[itemIndex];
            const newQuantity = Math.max(0, Math.min(item.maxQuantity, item.quantity + value));
            item.quantity = newQuantity;
            return newDonations;
        });
    };

    const handleDonation = async (shopId, items) => {
        try {
            console.log('Original items:', items);

            const filteredItems = items.filter(item => item.quantity > 0)
                .map(item => ({
                    name: item.itemName,
                    quantity: item.quantity,
                    unit: item.unit
                }));
            
            if (filteredItems.length === 0) {
                alert('Please select at least one item to donate');
                return;
            }

            console.log('Filtered items for donation:', filteredItems);

            const response = await axios.post(
                `/api/v1/donors/institute/${instituteId}/donate`,
                {
                    shopId,
                    items: filteredItems
                },
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status === 'success') {
                alert('Donation request sent successfully!');
                navigate(`/donate/${instituteId}`);
            }
        } catch (error) {
            console.error('Donation failed:', error);
            console.error('Error details:', error.response?.data);
            console.error('Request data:', {
                shopId,
                items: items.filter(item => item.quantity > 0)
                    .map(item => ({
                        name: item.itemName,
                        quantity: item.quantity,
                        unit: item.unit
                    }))
            });
            alert('Failed to process donation: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    if (!selectedShops || !instituteId) {
        return navigate('/');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-mycol-nyanza via-white to-mycol-celadon-2 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-mycol-brunswick_green hover:text-mycol-mint"
                >
                    <FiArrowLeft className="mr-2" /> Back
                </button>

                <h1 className="text-2xl font-bold text-mycol-brunswick_green mb-6">
                    Select Items for Donation
                </h1>

                {donations.map((shop, shopIndex) => (
                    <div key={shop.shopId} className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        {/* Shop Details */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">{shop.shopName}</h2>
                            <div className="space-y-2 text-gray-600">
                                <div className="flex items-center">
                                    <FiPhone className="mr-2" />
                                    <span>{shop.contactInfo.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiMail className="mr-2" />
                                    <span>{shop.contactInfo.email}</span>
                                </div>
                                <div className="flex items-start">
                                    <FiHome className="mr-2 mt-1" />
                                    <span>{shop.address.street}, {shop.address.city}</span>
                                </div>
                            </div>
                        </div>

                        {/* Items Selection */}
                        <div className="space-y-4">
                            {shop.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <FiBox className="text-mycol-mint mr-2" />
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    Available: {item.maxQuantity} {item.unit} • {item.category}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                            ₹{item.pricePerUnit}/{item.unit}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-end space-x-4">
                                        <button
                                            onClick={() => handleQuantityChange(shopIndex, itemIndex, -1)}
                                            className="p-2 text-gray-600 hover:text-mycol-mint disabled:opacity-50"
                                            disabled={item.quantity === 0}
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="w-16 text-center font-medium">
                                            {item.quantity} {item.unit}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(shopIndex, itemIndex, 1)}
                                            className="p-2 text-gray-600 hover:text-mycol-mint disabled:opacity-50"
                                            disabled={item.quantity >= item.maxQuantity}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    {item.quantity > 0 && (
                                        <div className="mt-2 text-right text-sm text-gray-600">
                                            Total: ₹{(item.quantity * item.pricePerUnit).toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Donation Button for each shop */}
                        <button
                            onClick={() => handleDonation(shop.shopId, shop.items)}
                            className="w-full mt-6 bg-mycol-brunswick_green text-white px-6 py-3 rounded-lg shadow hover:bg-opacity-90 transition-colors flex items-center justify-center"
                            disabled={!shop.items.some(item => item.quantity > 0)}
                        >
                            Donate to {shop.shopName} <FiSend className="ml-2" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
} 