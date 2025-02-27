import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewForm = ({ onSuccess, onCancel }) => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch donations to populate the dropdown
    const fetchDonations = async () => {
      try {
        const response = await axios.get('/api/v1/donations', {
          withCredentials: true
        });
        setDonations(response.data.data.donations);
      } catch (error) {
        toast.error('Failed to fetch donations');
      }
    };

    fetchDonations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDonation) {
      toast.error('Please select a donation');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please provide a comment with at least 10 characters');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/v1/reviews', {
        rating,
        comment,
        shopId: donations.find(d => d._id === selectedDonation).shop._id,
        donationId: selectedDonation
      }, {
        withCredentials: true
      });

      toast.success('Review submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit a Review</h2>

      {/* Donation Selection */}
      <div className="mb-4">
        <label htmlFor="donation" className="block text-sm font-medium text-gray-700 mb-2">
          Select Donation
        </label>
        <select
          id="donation"
          value={selectedDonation}
          onChange={(e) => setSelectedDonation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-mycol-mint"
        >
          <option value="">Select a donation</option>
          {donations.map((donation) => (
            <option key={donation._id} value={donation._id}>
              {donation.items.map(item => item.name).join(', ')} - {new Date(donation.createdAt).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none transition-colors"
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Comment Section */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-mycol-mint"
          placeholder="Tell us about your experience..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-sea_green transition-colors disabled:bg-gray-400"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </div>

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Review Guidelines:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Be honest and specific about your experience</li>
              <li>Keep it professional and constructive</li>
              <li>Minimum 10 characters required for the review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm; 