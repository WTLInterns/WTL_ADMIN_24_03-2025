"use client";

import { useState } from "react";
import axios from "axios";

const Outsourceform = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    vehicleNameAndRegNo: "",
    vehicleRcNo: "",
    carNoPlate: "",
    carOtherDetails: "",
  });

  const [files, setFiles] = useState({
    insurance: null,
    permit: null,
    authorization: null,
    carImage: null,
    frontImage: null,
    backImage: null,
    sideImage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Track success popup visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({
      ...files,
      [name]: selectedFiles[0], // Store the first selected file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Disable the submit button

    const data = new FormData();
    data.append("vehicleNameAndRegNo", formData.vehicleNameAndRegNo);
    data.append("vehicleRcNo", formData.vehicleRcNo);
    data.append("carNoPlate", formData.carNoPlate);
    data.append("carOtherDetails", formData.carOtherDetails);

    // Append files to FormData
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/vehicle/save",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      // Show success popup
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false); // Hide popup after 3 seconds
        onClose();
        onSuccess();
      }, 3000);

      // Reset form and close modal
      handleReset();
      // Trigger the callback to refresh the parent component's data
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("Failed to save vehicle. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  const handleReset = () => {
    setFormData({
      vehicleNameAndRegNo: "",
      vehicleRcNo: "",
      carNoPlate: "",
      carOtherDetails: "",
    });
    setFiles({
      insurance: null,
      permit: null,
      authorization: null,
      carImage: null,
      frontImage: null,
      backImage: null,
      sideImage: null,
    });
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 right-0 z-[1000]">
          <div className="bg-green-500 text-white p-4 text-center animate-slide-down">
            Vehicle saved successfully!
          </div>
        </div>
      )}

      {/* Modal */}
      <div
        id="modal-overlay"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={handleOutsideClick}
      >
        <div className="bg-white w-[95%] max-w-5xl h-auto max-h-[90vh] rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add Outsource Vehicle
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-2">
              <div>
                <label className="font-medium">Vehicle Name & Reg. No.</label>
                <input
                  type="text"
                  name="vehicleNameAndRegNo"
                  value={formData.vehicleNameAndRegNo}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>

              <div>
                <label className="font-medium">Vehicle RC No.</label>
                <input
                  type="text"
                  name="vehicleRcNo"
                  value={formData.vehicleRcNo}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>

              <div>
                <label className="font-medium">Car Plate No.</label>
                <input
                  type="text"
                  name="carNoPlate"
                  value={formData.carNoPlate}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>

              <div>
                <label className="font-medium">Insurance</label>
                <input
                  type="file"
                  name="insurance"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Permit</label>
                <input
                  type="file"
                  name="permit"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Authorization</label>
                <input
                  type="file"
                  name="authorization"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Car Image</label>
                <input
                  type="file"
                  name="carImage"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Front Image</label>
                <input
                  type="file"
                  name="frontImage"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Back Image</label>
                <input
                  type="file"
                  name="backImage"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Side Image</label>
                <input
                  type="file"
                  name="sideImage"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-medium">Car's Other Details</label>
                <textarea
                  name="carOtherDetails"
                  value={formData.carOtherDetails}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                // disabled={isSubmitting} // Disable button during submission
              >
Submit              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Outsourceform;