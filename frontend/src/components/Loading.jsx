import React from 'react';

const Loading = ({ fullScreen = false }) => {
  const content = (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
