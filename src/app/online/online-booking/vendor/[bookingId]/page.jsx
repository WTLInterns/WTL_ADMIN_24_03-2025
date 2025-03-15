"use client";

import Layout from "@/container/components/Navbar";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { bookingId } = useParams();
  const router = useRouter();
  console.log("Booking id from useParams:", bookingId);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [booking, setBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // State to control modal visibility

  // State for Vendor Cab and Driver
  const [vendorCab, setVendorCab] = useState({ isOpen: false }); // Add isOpen property
  const [vendorDriver, setVendorDriver] = useState({ isOpen: false }); // Add isOpen property

  // Modals for assigning vendor/driver/cab (omitted for brevity)
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isCabModalOpen, setIsCabModalOpen] = useState(false);

  // Fetch booking details once when bookingId is available
  useEffect(() => {
    if (bookingId) {
      fetch(`http://localhost:8080/booking/${bookingId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error fetching booking details");
          return res.json();
        })
        .then((data) => {
          setBooking(data);
          // Simulate fetching vendor cab and driver details (replace with actual API calls)
          setVendorCab((prev) => ({ ...prev, ...data.vendorCab }));
          setVendorDriver((prev) => ({ ...prev, ...data.vendorDriver }));
        })
        .catch((err) => console.error(err));
    }
  }, [bookingId]);

  const [vendors, setVendors] = useState([]); // Initialize vendors as an empty array

  console.log(booking);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/vendors/allVendors"
        );

        // Check if the response is OK (status 200)
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }

        const data = await response.json();
        setVendors(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const handleAssignVendor = async (vendorId) => {
    try {
      // Make the PUT request to assign the vendor
      const response = await axios.put(
        `http://localhost:8080/${bookingId}/assignVendor/${vendorId}`
      );

      // Handle the successful response (booking updated)
      alert("Vendor assigned successfully!");
      setIsVendorModalOpen(false); // Close the modal after successful assignment
    } catch (error) {
      console.error("Error assigning vendor:", error);
      alert("Failed to assign vendor.");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/${bookingId}/status`,
        { status: newStatus } // Send the new status in the request body
      );
      setBooking(response.data); // Update the booking status in state
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleComplete = () => {
    if (window.confirm("Are you sure you want to mark the trip complete?")) {
      fetch(`http://localhost:8080/complete-trip/${bookingId}`, {
        method: "POST",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Trip complete failed");
          return res.text();
        })
        .then((message) => {
          alert(message);
          setBooking((prev) => (prev ? { ...prev, status: 1 } : prev));
        })
        .catch((err) => alert(err.message));
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the trip?")) {
      fetch(`http://localhost:8080/cancel-trip/${bookingId}`, {
        method: "POST",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Cancellation failed");
          return res.text();
        })
        .then((message) => {
          alert(message);
          setBooking((prev) => (prev ? { ...prev, status: 2 } : prev));
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <Layout openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} className="text-black-400">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Row 1: Assignment Buttons */}
        <div className="flex flex-row gap-3">
          <button
            onClick={() => setIsVendorModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Assign Vendor
          </button>
        </div>

        {isVendorModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
              <h2 className="text-xl font-bold mb-4">Assign Vendor</h2>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Vendor Id</th>
                    <th className="border px-4 py-2">Vendor Company Name</th>
                    <th className="border px-4 py-2">Contact No</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Address</th>
                    <th className="border px-4 py-2">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="border px-4 py-2">{row.id}</td>
                      <td className="border px-4 py-2">
                        {row.vendorCompanyName}
                      </td>
                      <td className="border px-4 py-2">{row.contactNo}</td>
                      <td className="border px-4 py-2">{row.vendorEmail}</td>
                      <td className="border px-4 py-2">{row.city}</td>
                      <td className="border px-4 py-2 flex justify-center">
                        <button
                          className="border rounded-full p-2 flex items-center justify-center"
                          onClick={() => handleAssignVendor(row.id)}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setIsVendorModalOpen(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Row 2: Minimal Booking Summary (Always visible if booking loaded) */}
        {booking && (
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold mb-3">Client's Booking Summary</h2>
            <table className="w-full text-sm border border-gray-300">
              <tbody>
                <tr className="border-b">
                  <th className="p-2 w-40 bg-gray-100">Booking ID</th>
                  <td className="p-2">{booking.bookingId}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Name</th>
                  <td className="p-2">{booking.name}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">From</th>
                  <td className="p-2">{booking.fromLocation}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">To</th>
                  <td className="p-2">{booking.toLocation}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Trip Type</th>
                  <td className="p-2">{booking.tripType}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Start Date</th>
                  <td className="p-2">{booking.startDate}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Return Date</th>
                  <td className="p-2">{booking.returnDate || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Time</th>
                  <td className="p-2">{booking.time}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Amount</th>
                  <td className="p-2">{booking.amount}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">GST</th>
                  <td className="p-2">{booking.gst}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Service Charge</th>
                  <td className="p-2">{booking.serviceCharge}</td>
                </tr>
                <tr>
                  <th className="p-2 bg-gray-100">Car</th>
                  <td className="p-2">{booking.car || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Row 3: Accordions for Vendor Cab and Driver */}
        <div className="space-y-4">
          {/* Vendor Cab Accordion */}
          <div className="bg-white p-4 rounded shadow-md">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setVendorCab((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
            >
              <h2 className="text-lg font-bold">Vendor Cab</h2>
              <span>{vendorCab.isOpen ? "▲" : "▼"}</span>
            </div>
            {vendorCab.isOpen && (
              <div className="mt-4">
                {booking?.vendorCab ? (
                  <table className="w-full text-sm border border-gray-300">
                    <tbody>
                      <tr className="border-b">
                        <th className="p-2 bg-gray-100">Cab ID</th>
                        <td className="p-2">{booking.vendorCab.vendorCabId}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-2 bg-gray-100">Cab Model</th>
                        <td className="p-2">{booking.vendorCab.carName}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-2 bg-gray-100">License Plate</th>
                        <td className="p-2">{booking.vendorCab.rCNo}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">Not Assigned Yet</p>
                )}
              </div>
            )}
          </div>

          {/* Vendor Driver Accordion */}
          <div className="bg-white p-4 rounded shadow-md">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setVendorDriver((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
            >
              <h2 className="text-lg font-bold">Vendor Driver</h2>
              <span>{vendorDriver.isOpen ? "▲" : "▼"}</span>
            </div>
            {vendorDriver.isOpen && (
              <div className="mt-4">
                {booking?.vendorDriver ? (
                  <table className="w-full text-sm border border-gray-300">
                    <tbody>
                      <tr className="border-b">
                        <th className="p-2 bg-gray-100">Driver ID</th>
                        <td className="p-2">{booking.vendorDriver.vendorDriverId}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-2 bg-gray-100">Driver Name</th>
                        <td className="p-2">{booking.vendorDriver.driverName}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-2 bg-gray-100">Contact No</th>
                        <td className="p-2">{booking.vendorDriver.contactNo}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">Not Assigned Yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Bottom Action Buttons in one row */}
        <div className="flex flex-row items-center space-x-3">
          <button
            onClick={() => setShowDetailsModal(true)} // Open the modal
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
          >
            Show Details
          </button>
          <button
            onClick={() => handleUpdateStatus(2)}
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
          >
            Trip Complete
          </button>
          <button className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600">
            Send Email
          </button>
          <button
            onClick={() => handleUpdateStatus(3)}
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Modal for Full Booking Details */}
      {showDetailsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Full Booking Details</h2>
            {booking && (
              <table className="w-full text-sm border border-gray-300">
                <tbody>
                  <tr className="border-b">
                    <th className="p-2 w-40 bg-gray-100">ID</th>
                    <td className="p-2">{booking.id}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Booking ID</th>
                    <td className="p-2">{booking.bookingId}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">User ID</th>
                    <td className="p-2">{booking.userId}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Name</th>
                    <td className="p-2">{booking.name}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Email</th>
                    <td className="p-2">{booking.email}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Phone</th>
                    <td className="p-2">{booking.phone}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">From Location</th>
                    <td className="p-2">{booking.fromLocation}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">To Location</th>
                    <td className="p-2">{booking.toLocation}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Distance</th>
                    <td className="p-2">{booking.distance}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Trip Type</th>
                    <td className="p-2">{booking.tripType}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Start Date</th>
                    <td className="p-2">{booking.startDate}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Return Date</th>
                    <td className="p-2">{booking.returnDate || "N/A"}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Time</th>
                    <td className="p-2">{booking.time}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Amount</th>
                    <td className="p-2">{booking.amount}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">GST</th>
                    <td className="p-2">{booking.gst}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Service Charge</th>
                    <td className="p-2">{booking.serviceCharge}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 bg-gray-100">Status</th>
                    <td className="p-2">
                      {booking.status === 0
                        ? "Pending"
                        : booking.status === 1
                        ? "Confirmed"
                        : "Cancelled"}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 bg-gray-100">Booking Type</th>
                    <td className="p-2">{booking.bookingType || "N/A"}</td>
                  </tr>
                  <tr>
                    <th className="p-2 bg-gray-100">Description</th>
                    <td className="p-2">{booking.description || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            )}
            <button
              onClick={() => setShowDetailsModal(false)} // Close the modal
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Page;