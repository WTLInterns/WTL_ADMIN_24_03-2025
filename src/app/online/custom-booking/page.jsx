"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../container/components/Navbar";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Bookings = () => {
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tripType, setTripType] = useState("oneWay");
  const [userPickup, setUserPickUp] = useState("");
  const [userDrop, setUserDrop] = useState("");
  const [startDate, setStartDate] = useState("");
  const [time, setTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [car, setCar] = useState("Sedan");
  const [amount, setAmount] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const router = useRouter();

  // Bookings from backend
  const [bookings, setBookings] = useState([]);

  // Filter state for trip type (all, oneWay, roundTrip)
  const [filterTrip, setFilterTrip] = useState("all");

  // Form submission handler (ensuring bookingType is set to "custom_booking")
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userPickup || !userDrop || !startDate || !time || !amount) {
      alert("Please fill in all required fields.");
      return;
    }

    const bookingData = {
      bookingType: "custom_booking",
      tripType,
      userPickup,
      userDrop,
      startDate,
      time,
      returnDate,
      car,
      amount: parseFloat(amount),
    };

    try {
      const response = await fetch("https://api.worldtriplink.com/customBooking/b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure no charset=UTF-8
          Accept: "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const newBooking = await response.json();
        setBookings([...bookings, newBooking]);
        setIsFormOpen(false);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to add booking:", errorMessage);
      }
    } catch (error) {
      console.error("Error while adding booking", error);
    }
  };

  // Fetch bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await axios.get("https://api.worldtriplink.com/details");
      if (response.status === 200 && Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings to show only custom bookings and then by trip type if needed.
  const filteredBookings = bookings.filter((b) => {
    return (
      b.bookingType === "custom_booking" &&
      (filterTrip === "all" || b.tripType === filterTrip)
    );
  });

  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmed) return;

    // setDeleting(true);
    // setError(null);
    // setSuccessMessage(null);

    try {
      await axios.delete(`https://api.worldtriplink.com/delete/${bookingId}`);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.bookingId !== bookingId)
      );
      // setFilteredBookings((prevFiltered) =>
      //   prevFiltered.filter((booking) => booking.bookingId !== bookingId)
      // );
      // setSuccessMessage(
      //   `Booking with ID ${bookingId} has been deleted successfully.`
      // );

      fetchBookings();
    } catch (error) {
      setError("Error deleting booking");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gray-100 p-4 flex items-center justify-between rounded-lg shadow">
          <h2 className="font-semibold text-lg flex items-center">
            <span className="mr-2">🚖</span> Custom Bookings
          </h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="border p-2 rounded-md bg-black hover:bg-gray-800 text-white transition duration-300"
          >
            <FaPlus className="text-white" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="mt-4 flex items-center space-x-4">
          <label className="text-gray-700">Filter by Trip Type:</label>
          <select
            value={filterTrip}
            onChange={(e) => setFilterTrip(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Bookings</option>
            <option value="oneWay">One Way</option>
            <option value="roundTrip">Round Trip</option>
          </select>
        </div>

        {/* Booking Form */}
        {isFormOpen && (
          <div className="bg-white p-6 shadow-lg rounded-lg mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Custom Booking</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-red-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              {/* Trip Type */}
              <div className="mb-4">
                <label className="block text-gray-600 font-semibold mb-2">
                  Trip Type:
                </label>
                <div className="flex items-center space-x-4">
                  {["oneWay", "roundTrip"].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="tripType"
                        value={type}
                        checked={tripType === type}
                        onChange={() => setTripType(type)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Pickup Location"
                  className="border p-2 rounded w-full"
                  value={userPickup}
                  onChange={(e) => setUserPickUp(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Drop Location"
                  className="border p-2 rounded w-full"
                  value={userDrop}
                  onChange={(e) => setUserDrop(e.target.value)}
                />
                <div>
                  <label className="block text-gray-600">Start Date:</label>
                  <input
                    type="date"
                    className="border p-2 rounded w-full"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Time:</label>
                  <input
                    type="time"
                    className="border p-2 rounded w-full"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                {tripType === "roundTrip" && (
                  <div>
                    <label className="block text-gray-600">Return Date:</label>
                    <input
                      type="date"
                      className="border p-2 rounded w-full"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gray-600">Car Type:</label>
                  <select
                    value={car}
                    onChange={(e) => setCar(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-600">Amount:</label>
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white shadow-lg rounded-lg p-4 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Custom Bookings Overview
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Booking ID
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    PickUp Location
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Drop Location
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Date/Time
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Trip Type
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Car Type
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Start Date
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Return Date
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Delete
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-2 py-2 text-gray-700 text-xs">
                      {row.id}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-xs">
                      {row.userPickup}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-xs">
                      {row.userDrop}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-xs">
                      {row.startDate} {row.time}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-xs">
                    {row.tripType
    ? row.tripType
        .replace(/[- ]/g, "") // Remove hyphens and spaces
        .replace(/^./, (match) => match.toUpperCase()) // Capitalize the first letter
    : ""}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-xs">
                      {row.car}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-xs">
                      {row.startDate}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-xs">
                      {row.returnDate || "N/A"}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-xs">
                      {row.amount}
                    </td>
                    <td className=" p-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          row.status === 0
                            ? "bg-yellow-500" // Pending
                            : row.status === 1
                            ? "bg-blue-500" // Ongoing
                            : row.status === 2
                            ? "bg-green-500" // Completed
                            : row.status === 3
                            ? "bg-red-500" // Cancelled
                            : "bg-gray-500" // Default color for invalid or undefined status
                        } text-white`}
                      >
                        {row.status === 0
                          ? "Pending"
                          : row.status === 1
                          ? "Ongoing"
                          : row.status === 2
                          ? "Completed"
                          : row.status === 3
                          ? "Cancelled"
                          : "Unknown"}
                      </span>
                    </td>

                    <td className="p-2 text-center">
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteBooking(row.id)}
                        disabled={deleting}
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                    <td className=" p-2 text-center">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        onClick={() =>
                          router.push(`/online/online-booking/vendor/${row.id}`)
                        }
                      >
                        Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No custom bookings found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
