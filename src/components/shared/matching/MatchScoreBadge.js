const MatchScoreBadge = ({ score, size = "sm" }) => {
  const getColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const sizeClasses = size === "lg"
    ? "text-sm px-3 py-1"
    : "text-xs px-2 py-0.5";

  return (
    <span className={`${getColor()} text-white font-semibold rounded-full ${sizeClasses} inline-flex items-center gap-1`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {score}% match
    </span>
  );
};

export default MatchScoreBadge;
