"use client";
import { useState } from "react";
import { useAddReviewMutation } from "@/redux/services/reviewSlice";
import toast from "react-hot-toast";

const ReviewForm = ({ reviewerId, revieweeId, requirementId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [addReview, { isLoading }] = useAddReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await addReview({
        reviewerId,
        revieweeId,
        requirementId,
        rating,
        review: review.trim() || null,
      }).unwrap();

      toast.success("Review submitted successfully!");
      setRating(0);
      setReview("");
      onSuccess?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-whiteColor dark:bg-whiteColor-dark border border-borderColor dark:border-borderColor-dark rounded-lg p-4">
      <h4 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-3">
        Leave a Review
      </h4>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">Rating</label>
        <div className="flex items-center gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className={`transition-colors ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              } hover:text-yellow-400`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">Review (optional)</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-primaryColor text-white rounded text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
