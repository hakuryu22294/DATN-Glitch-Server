import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instanceApi from "../configs/api.config";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await instanceApi.get(`/verify/shipper/${token}`);
        setStatus("success");
        setMessage("Your email has been successfully verified!");
      } catch (error) {
        setStatus("error");
        setMessage(
          "There was an error verifying your email. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
        </div>
        <div className="mt-8">
          {status === "loading" && (
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-gray-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4V2m0 20v-2m6-6h2m-20 0h2m13.656-8.656l1.414 1.414M5.656 17.656l1.414-1.414M16.97 15.656l1.414-1.414M6.97 5.656l1.414 1.414"
                />
              </svg>
              <p className="text-gray-600 mt-4">Verifying your email...</p>
            </div>
          )}
          {status === "success" && (
            <div className="bg-green-100 text-green-700 p-4 rounded-md shadow-md">
              <h3 className="text-lg font-medium">Success!</h3>
              <p>{message}</p>
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-md">
              <h3 className="text-lg font-medium">Error</h3>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
