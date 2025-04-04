"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import Navbar from "../../../container/components/Navbar";

// Set the base URL for API calls.
// NOTE: "localhost" will not work on mobile devices. 
// Update BASE_URL to your server's accessible IP address if needed.
const BASE_URL = "http://localhost:8080";

const AllVendors = () => {
  // State for manual email modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualEmail, setManualEmail] = useState("");

  // Function to send email manually using path variable
  const handleSendManualEmail = async () => {
    if (!manualEmail) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/vendors/send-manual/${encodeURIComponent(manualEmail)}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        alert("Email sent successfully");
        setManualEmail("");
        setShowManualModal(false);
      } else {
        alert("Error sending email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [newVendor, setNewVendor] = useState({
    vendorCompanyName: "",
    contactNo: "",
    alternateMobileNo: "",
    city: "",
    vendorEmail: "",
    bankName: "",
    bankAccountNo: "",
    ifscCode: "",
    aadharNo: "",
    panNo: "",
    udyogAadharNo: "",
    govtApprovalCertificate: null,
    vendorImage: null,
    aadharPhoto: null,
    panPhoto: null,
    vendorOtherDetails: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/vendors/allVendors`);
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
      setLoading(false);
    };

    fetchVendors();
  }, []);

  const handleFileChange = (e) => {
    setNewVendor((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newVendor).forEach((key) => {
      if (newVendor[key]) {
        formData.append(key, newVendor[key]);
      }
    });

    try {
      const response = await fetch(`${BASE_URL}/vendors/add`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowForm(false);
        const updatedVendor = await response.json();
        setVendors((prev) => [...prev, updatedVendor]);
        setNewVendor({
          vendorCompanyName: "",
          contactNo: "",
          alternateMobileNo: "",
          city: "",
          vendorEmail: "",
          bankName: "",
          bankAccountNo: "",
          ifscCode: "",
          aadharNo: "",
          panNo: "",
          udyogAadharNo: "",
          govtApprovalCertificate: null,
          vendorImage: null,
          aadharPhoto: null,
          panPhoto: null,
          vendorOtherDetails: "",
        });
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 1000);
      } else {
        alert("Error adding vendor");
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const response = await fetch(
        `${BASE_URL}/vendors/delete/${vendorId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Vendor deleted successfully");
        setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
      } else {
        alert("Error deleting vendor");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Filter vendors based on the search input
  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendorCompanyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Navbar>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          All Vendor Details
        </h2>

        <div className="mb-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by vendor name..."
            className="w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Add Vendor
          </button>
          {/* Button to open manual email modal */}
          <button
            onClick={() => setShowManualModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            Send Manually
          </button>
        </div>

        {showSuccessPopup && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <div className="bg-green-500 text-white p-4 text-center animate-slide-down">
              Vendor saved successfully!
            </div>
          </div>
        )}

        {showForm && (
          <form
            className="bg-gray-100 p-6 rounded-lg shadow-md relative"
            onSubmit={handleSubmit}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Vendor</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(newVendor).map((key) => (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="mb-1 font-semibold">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  {key.includes("Photo") ||
                  key.includes("Image") ||
                  key.includes("Docs") ||
                  key.includes("Certificate") ? (
                    <input
                      id={key}
                      name={key}
                      type="file"
                      className="p-2 border border-gray-300 rounded-lg"
                      onChange={handleFileChange}
                    />
                  ) : (
                    <input
                      id={key}
                      type="text"
                      placeholder={key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      className="p-2 border border-gray-300 rounded-lg"
                      value={newVendor[key]}
                      onChange={(e) =>
                        setNewVendor((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Submit
            </button>
          </form>
        )}

        {/* Manual Email Modal */}
        {showManualModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-xl font-semibold mb-4">Send Manually</h3>
              <input
                type="email"
                placeholder="Enter Gmail address"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleSendManualEmail}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>
                <button
                  onClick={() => setShowManualModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">Vendor Name</th>
                  <th className="p-3 text-left">Contact No.</th>
                  <th className="p-3 text-left">City</th>
                  <th className="p-3 text-left">Udyog Aadhar</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Bank</th>
                  <th className="p-3 text-left">Aadhar</th>
                  <th className="p-3 text-center">View</th>
                  <th className="p-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b bg-gray-100">
                    <td className="p-3">{vendor.vendorCompanyName}</td>
                    <td className="p-3">{vendor.contactNo}</td>
                    <td className="p-3">{vendor.city}</td>
                    <td className="p-3">{vendor.udyogAadharNo}</td>
                    <td className="p-3">{vendor.vendorEmail}</td>
                    <td className="p-3">{vendor.bankName}</td>
                    <td className="p-3">{vendor.aadharNo}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          router.push(`/vendor-details/${vendor.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                      >
                        <FaEye size={20} />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="text-red-600 hover:text-red-800 transition duration-200"
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default AllVendors;