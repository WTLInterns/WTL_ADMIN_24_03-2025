"use client";

import { useState } from "react";
import axios from "axios";

const AddDriverModal = ({ isOpen, onClose,        onSuccess}) => {
  const [formData, setFormData] = useState({
    DriverName: "",
    ContactNo: "",
    AltMobNum: "",
    Adress: "",
    otherDetails: "",
    aadhaNo: "",
    drLicenseNo: "",
    pvcNo2: "",
    status: "",
    emailId: "",
  });

  const [files, setFiles] = useState({
    DriverImgSelfie: null,
    Aadhar: null,
    authorizationImage: null,
    DrLicenceNum: null,
    PvcNo: null,
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0], // Store the first selected file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("DriverName", formData.DriverName);
    data.append("ContactNo", formData.ContactNo);
    data.append("AltMobNum", formData.AltMobNum);
    data.append("Adress", formData.Adress);
    data.append("otherDetails", formData.otherDetails);
    data.append("aadhaNo", formData.aadhaNo);
    data.append("drLicenseNo", formData.drLicenseNo);
    data.append("pvcNo2", formData.pvcNo2);
    data.append("status", "PENDING");
    data.append("emailId", formData.emailId);

    // Append files to FormData
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });

    try {
      const response = await axios.post(
        "https://api.worldtriplink.com/driverAdmin/save",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setShowSuccessPopup(true); // Show success popup
      setTimeout(() => {
        setShowSuccessPopup(false); // Hide success popup after 3 seconds
        onClose(); // Close the modal
        onSuccess(); // Trigger the callback to refresh the driver list

      }, 3000);

      console.log(response.data);
    } catch (error) {
      console.error("Error saving driver:", error);
      alert("Failed to save driver. Please try again.");
    }
  };

  if (!isOpen) return null;

  // ✅ Handle Reset Form with consistent keys
  const handleReset = () => {
    setFormData({
      DriverName: "",
      ContactNo: "",
      AltMobNum: "",
      emailId: "",
      Adress: "",
      aadhaNo: "",
      drLicenseNo: "",
      pvcNo2: "",
      otherDetails: "",
      status: "",
    });
    setFiles({
      DriverImgSelfie: null,
      Aadhar: null,
      authorizationImage: null,
      DrLicenceNum: null,
      PvcNo: null,
    });
  };

  // ✅ Handle Modal Close when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="bg-green-500 text-white p-4 text-center animate-slide-down">
            Driver saved successfully!
          </div>
        </div>
      )}

      {/* Modal */}
      <div
        id="modal-overlay"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={handleOutsideClick}
      >
        <div className="bg-white w-[95%] max-w-5xl h-auto max-h-[90vh] rounded-lg shadow-lg p-6 ">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add Driver Form
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-2">
              <div>
                <label className="font-medium">Driver Name</label>
                <input
                  type="text"
                  name="DriverName"
                  value={formData.DriverName}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Contact No.</label>
                <input
                  type="text"
                  name="ContactNo"
                  value={formData.ContactNo}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Alternate Mobile No.</label>
                <input
                  type="text"
                  name="AltMobNum"
                  value={formData.AltMobNum}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Driver's Email ID</label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-medium">Address</label>
                <textarea
                  name="Adress"
                  value={formData.Adress}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                ></textarea>
              </div>

              <div>
                <label className="font-medium">Driver's Image/Selfie</label>
                <input
                  type="file"
                  name="DriverImgSelfie"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Adhaar Card No.</label>
                <input
                  type="text"
                  name="aadhaNo"
                  value={formData.aadhaNo}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  placeholder="Enter Adhaar Card No."
                />
                <input
                  type="file"
                  name="Aadhar"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">Driving Licence No.</label>
                <input
                  type="text"
                  name="drLicenseNo"
                  value={formData.drLicenseNo}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  placeholder="Enter Driving Licence No."
                />
                <input
                  type="file"
                  name="DrLicenceNum"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="font-medium">PVC No.</label>
                <input
                  type="text"
                  name="pvcNo2"
                  value={formData.pvcNo2}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                  placeholder="Enter PVC No."
                />
                <input
                  type="file"
                  name="PvcNo"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-medium">Other Details</label>
                <textarea
                  name="otherDetails"
                  value={formData.otherDetails}
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
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDriverModal;