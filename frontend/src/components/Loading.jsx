const Loading = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8" role="status" aria-label="Đang tải">
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white shadow-[0_8px_24px_rgba(32,55,43,0.08)]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-100 border-t-primary-500" />
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a8780]">Đang tải</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f5f8f6]">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
