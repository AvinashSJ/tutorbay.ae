"use client";
import { useGetReviewsForUserQuery } from "@/redux/services/reviewSlice";
import StarRating from "./StarRating";

const ReviewList = ({ userId, title = "Reviews" }) => {
  const { data: reviews, isLoading, error } = useGetReviewsForUserQuery(userId, {
    skip: !userId,
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-whiteColor dark:bg-whiteColor-dark rounded-lg shadow-accordion">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-whiteColor dark:bg-whiteColor-dark rounded-lg shadow-accordion">
        <p className="text-red-500">Failed to load reviews.</p>
      </div>
    );
  }

  if (!reviews?.length) {
    return null;
  }

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark flex items-center justify-between">
        <h3 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(parseFloat(avgRating))} />
          <span className="text-sm text-gray-500">({avgRating})</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-borderColor dark:border-borderColor-dark rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-blackColor dark:text-blackColor-dark">
                  {review.reviewer?.fullName || "Anonymous"}
                </span>
                <StarRating rating={review.rating} />
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.review && (
              <p className="text-sm text-contentColor dark:text-contentColor-dark">
                {review.review}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
