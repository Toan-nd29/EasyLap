const ProgressBar = ({ current, total }) => {
  const percentage = total > 0
    ? Math.min(100, Math.max(0, (current / total) * 100))
    : 0;

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-[#e5ece8]"
      role="progressbar"
      aria-label="Tiến độ bài tư vấn"
      aria-valuemin="0"
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-[0_0_12px_rgba(37,200,117,0.35)] transition-[width] duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
