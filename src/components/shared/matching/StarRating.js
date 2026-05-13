const StarRating = ({ rating, maxRating = 5, size = "sm" }) => {
  const sizeClass = size === "lg" ? "text-lg" : "text-sm";

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {Array.from({ length: maxRating }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
