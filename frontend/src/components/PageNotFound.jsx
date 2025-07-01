import React from "react";

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg sm:text-xl text-green-900 font-semibold text-center">
        Page Not Found
      </p>
    </div>
  );
}

export default PageNotFound;
