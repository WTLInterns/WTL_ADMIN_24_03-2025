"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../../container/components/Navbar";

export default function B2BDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [selectedB2B, setSelectedB2B] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal for viewing an image
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  // Helper: Build full image URL if not already absolute.
  // If the path starts with "/uploads/", it prepends "http://localhost:8080"
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads/")) {
      return "http://localhost:8080" + path;
    }
    return "http://localhost:8080/uploads/" + path;
  };

  // Fetch the B2B record by ID from the backend
  useEffect(() => {
    async function fetchB2B() {
      try {
        const response = await fetch(`http://localhost:8080/b2b/${params.id}`);
        if (!response.ok) {
          throw new Error("B2B not found");
        }
        const data = await response.json();
        console.log("Fetched B2B details:", data);
        setSelectedB2B(data);
      } catch (error) {
        console.error("Error fetching B2B details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchB2B();
  }, [params.id]);

  if (loading) {
    return (
      <Navbar>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">B2B Details</h2>
          <p>Loading...</p>
        </div>
      </Navbar>
    );
  }
  if (!selectedB2B) {
    return (
      <Navbar>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">B2B Details</h2>
          <p>Record not found.</p>
        </div>
      </Navbar>
    );
  }

  // When "View Doc" is clicked, open the modal with the proper image URL.
  const handleViewDoc = (imagePath) => {
    const fullUrl = buildImageUrl(imagePath);
    console.log("Opening image modal with URL:", fullUrl);
    setImageSrc(fullUrl);
    setShowImageModal(true);
  };

  const handleClose = () => router.back();

  return (
    <Navbar>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-5xl mx-auto">
        {/* Header with Close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">B2B Details</h2>
          <button onClick={handleClose} className="bg-red-600 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Panel: Profile Details */}
          <div className="w-full md:w-2/3 bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Profile Details</h3>

            {/* Company Information */}
            <h4 className="font-semibold mb-2">Company Information</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="font-medium">Company Name</p>
                <p>{selectedB2B.companyName || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Mobile</p>
                <p>{selectedB2B.contactNo || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="font-medium">Business Email</p>
                <p>{selectedB2B.businessEmail || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Alternate Mobile</p>
                <p>{selectedB2B.alternateMobileNo || "N/A"}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="font-medium">City</p>
              <p>{selectedB2B.city || "N/A"}</p>
            </div>

            {/* Bank Details */}
            <h4 className="font-semibold mb-2">Bank Details</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium">Acc No</p>
                <p>{selectedB2B.bankAccountNo || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">IFSC Code</p>
                <p>{selectedB2B.ifscCode || "N/A"}</p>
              </div>
            </div>

            {/* Company Logo */}
            <div className="mt-6">
              <p className="font-medium mb-2">Company Logo</p>
              {selectedB2B.companyLogo ? (
                <img
                  src={buildImageUrl(selectedB2B.companyLogo)}
                  alt="Company Logo"
                  className="w-24 h-24 object-cover border rounded"
                />
              ) : (
                <p className="text-gray-500">No logo uploaded</p>
              )}
            </div>
          </div>

          {/* Right Panel: Certificates & Docs */}
          <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Certificates & Docs</h3>

            <div className="mb-4">
              <p className="font-medium">Govt Approval Certificate</p>
              {selectedB2B.govtApprovalCertificate ? (
                <button
                  onClick={() => handleViewDoc(selectedB2B.govtApprovalCertificate)}
                  className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
                >
                  View Doc
                </button>
              ) : (
                <p className="text-gray-500">No certificate uploaded</p>
              )}
            </div>

            <div className="mb-4">
              <p className="font-medium">Company Docs</p>
              {selectedB2B.companyDocs ? (
                <button
                  onClick={() => handleViewDoc(selectedB2B.companyDocs)}
                  className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
                >
                  View Doc
                </button>
              ) : (
                <p className="text-gray-500">No document uploaded</p>
              )}
            </div>

            <div className="mb-4">
              <p className="font-medium">PAN Docs</p>
              {selectedB2B.panDocs ? (
                <button
                  onClick={() => handleViewDoc(selectedB2B.panDocs)}
                  className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
                >
                  View Doc
                </button>
              ) : (
                <p className="text-gray-500">No PAN docs uploaded</p>
              )}
            </div>

            <div className="mt-4">
              <p className="font-medium">PAN Number</p>
              <p>{selectedB2B.panNo || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* <p className="mt-6 text-green-600">
          This B2B is available to assign driver and cab
        </p>
        <div className="mt-4 flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Send Login Username and Password
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded">
            Block
          </button>
        </div> */}
      </div>

      {/* Image Modal */}
      {showImageModal && imageSrc && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
            <img src={imageSrc} alt="Document" className="w-full h-auto" />
          </div>
        </div>
      )}
    </Navbar>
  );
}
