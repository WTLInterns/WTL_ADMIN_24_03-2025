"use client";

import Layout from "@/container/components/Navbar";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import $ from "jquery";


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
  const [cabAdmin,setCabAdmin]=useState([])
  const[driverAdmin, setDriverAdmin]=useState([])

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

  console.log(vendors);

  const handleAssignVendor = async (vendorId) => {
    try {
      // Make the PUT request to assign the vendor
      const response = await axios.put(
        `http://localhost:8080/${bookingId}/assignVendor/${vendorId}`
      );

      // Handle the successful response (booking updated)
      alert("Vendor assigned successfully!");
      handleUpdateStatus(0);

      setIsVendorModalOpen(false); // Close the modal after successful assignment
    } catch (error) {
      console.error("Error assigning vendor:", error);
      alert("Failed to assign vendor.");
    }
  };


  const handleAssignCab = async (cabAdminId) => {
    try {
      // Make the PUT request to assign the vendor
      const response = await axios.put(
        `http://localhost:8080/${bookingId}/assignCabAdmin/${cabAdminId}`
      );

      // Handle the successful response (booking updated)
      alert("Cab assigned successfully!");
      handleUpdateStatus(0);

      setIsVendorModalOpen(false); // Close the modal after successful assignment
    } catch (error) {
      console.error("Error assigning vendor:", error);
      alert("Cab assigned successfully!");
    }
  };


  const handleAssignDriver = async (driverAdminId) => {
    try {
      // Make the PUT request to assign the vendor
      const response = await axios.put(
        `http://localhost:8080/${bookingId}/assignDriveAdmin/${driverAdminId}`
      );

      // Handle the successful response (booking updated)
      alert("Driver assigned successfully!");
      handleUpdateStatus(0);

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

  const getCabAdmin = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cabAdmin/all");
      setCabAdmin(response.data);
    } catch (error) {
      console.error("Error fetching cab admin data:", error);
    }
  };

useEffect(()=>{
  getCabAdmin();
},[])

console.log(cabAdmin)

const getDriverAdmin = async () => {
  try {
    const response = await axios.get("http://localhost:8080/driverAdmin/all");
    setDriverAdmin(response.data);
  } catch (error) {
    console.error("Error fetching cab admin data:", error);
  }
};

useEffect(()=>{
  getDriverAdmin()
},[])

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


  // for accordian 
  const [vendorCabOpen, setVendorCabOpen] = useState(false);
  const [vendorDriverOpen, setVendorDriverOpen] = useState(false);

  // Toggle Vendor Cab Accordion
  const toggleVendorCab = () => {
    setVendorCabOpen(!vendorCabOpen);
    // jQuery slide animation
    if (!vendorCabOpen) {
      $(".vendor-cab-content").slideDown();
      $(".vendor-cab-icon").text("▲");
    } else {
      $(".vendor-cab-content").slideUp();
      $(".vendor-cab-icon").text("▼");
    }
  };

  // Toggle Vendor Driver Accordion
  const toggleVendorDriver = () => {
    setVendorDriverOpen(!vendorDriverOpen);
    // jQuery slide animation
    if (!vendorDriverOpen) {
      $(".vendor-driver-content").slideDown();
      $(".vendor-driver-icon").text("▲");
    } else {
      $(".vendor-driver-content").slideUp();
      $(".vendor-driver-icon").text("▼");
    }
  };

  return (
    <Layout
      openDropdown={openDropdown}
      setOpenDropdown={setOpenDropdown}
      className="text-black-400"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Row 1: Assignment Buttons */}
        <div className="flex flex-row gap-3">
          <button
            onClick={() => setIsVendorModalOpen(true)}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600  ${booking?.cabAdmin || booking?.driverAdmin ? "bg-gray-700 cursor-not-allowed":"`bg-green-500 text-white"} `} 
            disabled={!!booking?.driverAdmin && !!booking?.cabAdmin}
            title={
              booking?.driverAdmin ? "You cant assign this booking to vendor, you already assign  selft cab and driver" : ""
            }
          >
            Assign Vendor
          </button>

          <button
            onClick={() => setIsDriverModalOpen(true)}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600   ${booking?.driverAdmin
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                  }`  }
                  disabled={!!booking?.driverAdmin}
                title={
                  booking?.driverAdmin ? "Driver is already assigned by Admin" : ""
                }
          >
            Assign Driver
          </button>
          <button
            onClick={() => setIsCabModalOpen(true)}
            className={`bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600  ${booking?.cabAdmin
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 text-white"
                  }`  }
                  disabled={!!booking?.cabAdmin}
                title={
                  booking?.cabAdmin ? "Cab is already assigned by Admin" : ""
                }
          >
            Assign Cab
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
                        {booking.vendor && booking.vendor.id === row.id ? (
                          <div className="flex flex-col items-center">
                            <button
                              className="border rounded-full p-2 flex items-center justify-center bg-gray-300 cursor-not-allowed"
                              disabled
                              title={
                                booking.status === 5
                                  ? "This booking is cancel by this vendor. You can't assign them again."
                                  : "This booking is already assigned to a vendor. You can't assign them again."
                              }
                            >
                              Assign
                            </button>
                          </div>
                        ) : (
                          <button
                            className="border rounded-full p-2 flex items-center justify-center hover:bg-gray-100"
                            onClick={() => handleAssignVendor(row.id)}
                          >
                            Assign
                          </button>
                        )}
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



        {/* assign cab */}
        {isCabModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
              <h2 className="text-xl font-bold mb-4">Assign Admin Cab</h2>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Cab Id</th>
                    <th className="border px-4 py-2">Vehicle Name/Registration No</th>
                    <th className="border px-4 py-2">Vehicle RC.No</th>

                    <th className="border px-4 py-2">Other Details</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Assign</th>

                    
                  </tr>
                </thead>
                <tbody>
                  {cabAdmin.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="border px-4 py-2">{row.id}</td>
                     
                      <td className="border px-4 py-2">{row.vehicleNameAndRegNo}</td>
                      <td className="border px-4 py-2">{row.vehicleRcNo}</td>
                      <td className="border px-4 py-2">{row.carOtherDetails}</td>
                      <td className="border px-4 py-2">{row.status}</td>

                      <td className="border px-4 py-2 flex justify-center">
                        {booking.cabAdmin && booking.cabAdmin.id === row.id ? (
                          <div className="flex flex-col items-center">
                            <button
                              className="border rounded-full p-2 flex items-center justify-center bg-gray-300 cursor-not-allowed"
                              disabled
                              title={
                                booking.status === 5
                                  ? "This booking is cancel by this vendor. You can't assign them again."
                                  : "This booking is already assigned to a vendor. You can't assign them again."
                              }
                            >
                              Assign
                            </button>
                          </div>
                        ) : (
                          <button
                            className="border rounded-full p-2 flex items-center justify-center hover:bg-gray-100"
                            onClick={() => handleAssignCab(row.id)}
                          >
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setIsCabModalOpen(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}


        {/* assign driver */}

        {isDriverModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
              <h2 className="text-xl font-bold mb-4">Assign Vendor</h2>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Driver Id</th>
                    <th className="border px-4 py-2">Driver Name</th>
                    <th className="border px-4 py-2">Contact No</th>
                    <th className="border px-4 py-2">Alernate Contact No</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {driverAdmin.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="border px-4 py-2">{row.id}</td>
                      <td className="border px-4 py-2">
                        {row.driverName}
                      </td>
                      <td className="border px-4 py-2">{row.contactNo}</td>
                      <td className="border px-4 py-2">{row.altMobNum}</td>
                      <td className="border px-4 py-2">{row.emailId}</td>
                      <td className="border px-4 py-2 flex justify-center">
                        {booking.driverAdmin && booking.driverAdmin.id === row.id ? (
                          <div className="flex flex-col items-center">
                            <button
                              className="border rounded-full p-2 flex items-center justify-center bg-gray-300 cursor-not-allowed"
                              disabled
                              title={
                                booking.status === 5
                                  ? "This booking is cancel by this vendor. You can't assign them again."
                                  : "This booking is already assigned to a vendor. You can't assign them again."
                              }
                            >
                              Assign
                            </button>
                          </div>
                        ) : (
                          <button
                            className="border rounded-full p-2 flex items-center justify-center hover:bg-gray-100"
                            onClick={() => handleAssignDriver(row.id)}
                          >
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setIsDriverModalOpen(false)}
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
                  <td className="p-2">
                    {booking.tripType
                      ? booking.tripType
                          .replace(/[- ]/g, "") // Remove hyphens and spaces
                          .replace(/^./, (match) => match.toUpperCase()) // Capitalize the first letter
                      : ""}
                  </td>
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

        {booking && booking.vendor && (<div className="space-y-4">
          <div className="bg-white p-4 rounded shadow-md">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setVendorCab((prev) => ({ ...prev, isOpen: !prev.isOpen }))
              }
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
              onClick={() =>
                setVendorDriver((prev) => ({ ...prev, isOpen: !prev.isOpen }))
              }
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
                        <td className="p-2">
                          {booking.vendorDriver.vendorDriverId}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-2 bg-gray-100">Driver Name</th>
                        <td className="p-2">
                          {booking.vendorDriver.driverName}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-2 bg-gray-100">Contact No</th>
                        <td className="p-2">
                          {booking.vendorDriver.contactNo}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">Not Assigned Yet</p>
                )}
              </div>
            )}
          </div>
        </div>) }




        {/* master admin */}

         <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={toggleVendorCab}
        >
          <h2 className="text-lg font-bold">Admin Cab</h2>
          <span className="vendor-cab-icon">▼</span>
        </div>
        <div
          className="mt-4 vendor-cab-content"
          style={{ display: vendorCabOpen ? "block" : "none" }}
        >
          <div className="vendor-cab-details">
            <table className="w-full text-sm border border-gray-300">
              <tbody>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Cab ID</th>
                  <td className="p-2">1234</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Cab Model</th>
                  <td className="p-2">Toyota Prius</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">License Plate</th>
                  <td className="p-2">XYZ-123</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={toggleVendorDriver}
        >
          <h2 className="text-lg font-bold">Admin Driver</h2>
          <span className="vendor-driver-icon">▼</span>
        </div>
        <div
          className="mt-4 vendor-driver-content"
          style={{ display: vendorDriverOpen ? "block" : "none" }}
        >
          <div className="vendor-driver-details">
            <table className="w-full text-sm border border-gray-300">
              <tbody>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Driver ID</th>
                  <td className="p-2">5678</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Driver Name</th>
                  <td className="p-2">John Doe</td>
                </tr>
                <tr className="border-b">
                  <th className="p-2 bg-gray-100">Contact No</th>
                  <td className="p-2">+1234567890</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
                    <td className="p-2">
                      {booking.tripType
                        ? booking.tripType
                            .replace(/[- ]/g, "") // Remove hyphens and spaces
                            .replace(/^./, (match) => match.toUpperCase()) // Capitalize the first letter
                        : ""}
                    </td>{" "}
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
