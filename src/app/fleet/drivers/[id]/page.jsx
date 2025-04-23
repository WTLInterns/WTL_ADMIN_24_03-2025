"use client";
import React, { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import Navbar from "../../../../container/components/Navbar";
import { useParams } from "next/navigation";
import axios from "axios";

const ArrowPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [cab, setCab] = useState({});
  const params = useParams();
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  // Function to open modal with a dynamic title
  const openModal = (title) => {
    setModalTitle(title);
    setShowModal(true);
  };

  // Fetching data from the backend
  useEffect(() => {
    axios
      .get(`https://api.worldtriplink.com/driverAdmin/${params.id}`)
      .then((response) => {
        console.log("Fetched cab data:", response.data); // Debugging
        setCab(response.data);
      })
      .catch((error) => console.error("Error fetching vehicle:", error));
  }, [params.id]);

  // Function to handle status update
  const updateStatus = (status) => {
    if (status !== "COMPLETED" && status !== "PENDING") {
      setMessage("Invalid status! Status must be 'COMPLETED' or 'PENDING'.");
      return;
    }

    axios
      .put(
        `https://api.worldtriplink.com/driverAdmin/${params.id}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setMessage(`Status updated successfully to ${response.data.status}`);
        setSuccessMessage(`Status updated successfully to ${response.data.status}`);
        setShowSuccessModal(true); // Show success popup
        setCab((prevCab) => ({ ...prevCab, status: response.data.status })); // Update cab status
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setMessage("CabAdmin not found!");
        } else {
          setMessage("An error occurred while updating the status.");
        }
      });
  };

  // Image fields mapping
  const imageFields = {
    "Driver Selfie": "driverImgSelfie",
    Aadhar: "aadhar",
    "Driver License No": "drLicenceNum",
    "PVC No": "pvcNo",
  };

  return (
    <Navbar>
      <div className="container mx-auto p-4">
        {/* Vehicle Details Header */}
        <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg shadow-md">
          <FaCar className="text-blue-500 text-xl" />
          <h2 className="text-lg font-semibold text-gray-700">
            Driver Details
          </h2>
        </div>

        {/* Main Content */}
        <div className="relative flex items-center bg-white p-6 rounded-lg shadow-lg mt-10">
          {/* Left - Vehicle Image and Text */}
          <div className="w-1/2 h-[500px] flex flex-col justify-center items-center">
            {cab.driverImgSelfie ? (
              <img
                src={`https://api.worldtriplink.com/images/driverAdminImg/${cab.driverImgSelfie}`}
                alt="Driver Selfie"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>No Image Available</span>
            )}

            {/* Additional Documents */}
            <div className="flex justify-start mt-4 space-x-6">
              {["aadhar", "drLicenceNum", "pvcNo"].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  {cab[field] ? (
                    <img
                      src={`https://api.worldtriplink.com/images/driverAdminImg/${cab[field]}`}
                      alt={field}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Buttons */}
          <div className="w-[28%] flex flex-col justify-start p-4 space-y-6 mt-10 ml-6">
            {Object.keys(imageFields).map((label) => (
              <React.Fragment key={imageFields[label]}>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-700 w-full">
                    {label}
                  </span>
                  <button
                    className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                    onClick={() => openModal(label)}
                  >
                    Show Image
                  </button>
                </div>
                <hr className="border-t-2 border-gray-300" />
              </React.Fragment>
            ))}
          </div>

          {/* Approve/Reject Buttons */}
          <div className="absolute top-4 right-4 flex space-x-4">
            <button
              onClick={() => updateStatus("COMPLETED")}
              className={`bg-green-500 text-white py-2 px-4 rounded-lg ${
                cab.status === "COMPLETED"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600"
              }`}
              disabled={cab.status === "COMPLETED"} // Disable if status is already COMPLETED
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus("PENDING")}
              className={`bg-red-500 text-white py-2 px-4 rounded-lg ${
                cab.status === "PENDING"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-600"
              }`}
              disabled={cab.status === "PENDING"} // Disable if status is already PENDING
            >
              Reject
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pt-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
              <h2 className="text-xl font-semibold mb-4 text-black">
                {modalTitle}
              </h2>

              {/* Dynamic Image Rendering */}
              {imageFields[modalTitle] && cab[imageFields[modalTitle]] ? (
                <img
                  src={`https://api.worldtriplink.com/images/driverAdminImg/${
                    cab[imageFields[modalTitle]]
                  }`}
                  alt={modalTitle}
                  className="w-full h-full object-cover mb-5"
                />
              ) : (
                <span>No Image Available</span>
              )}

              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Success Modal with Slide-In Animation */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] mt-20 slide-in">
              <h2 className="text-xl font-semibold mb-4 text-black">Success</h2>
              <p className="text-gray-700 mb-4">{successMessage}</p>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for Slide-In Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .slide-in {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </Navbar>
  );
};

export default ArrowPage;