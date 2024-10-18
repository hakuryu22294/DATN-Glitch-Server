import React from "react";
import { useNavigate } from "react-router-dom";

const ForbiddenError = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">403 Forbidden</h1>
        <p className="text-lg text-gray-700 mb-6">
          Bạn không đủ quyền truy cập vào trang này.
        </p>
        <button
          onClick={handleBackHome}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default ForbiddenError;
