"use client";
import React, { useEffect, useState } from "react";
import Home from "../../container/components/Navbar";
import axios from "axios";

const Page = () => {
  const [filter, setFilter] = useState("companyName");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vendors, setVendors] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [allPenalties, setAllPenalties] = useState([]);
  const [filteredPenalties, setFilteredPenalties] = useState([]);

  useEffect(() => {
    const getAllVendors = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vendors/allVendors");
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    getAllVendors();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = allPenalties.filter((penalty) => {
        const penaltyDate = new Date(penalty.date);
        return penaltyDate >= new Date(startDate) && penaltyDate <= new Date(endDate);
      });
      setFilteredPenalties(filtered);
    }
  }, [startDate, endDate, allPenalties]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setSelectedVendor("");
    setStartDate("");
    setEndDate("");
    setPenalties([]);
  };

  const handleVendorChange = async (e) => {
    setSelectedVendor(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(
          `http://localhost:8080/get${filter === "id" ? "Penalty" : "ByName"}/${e.target.value}`
        );
        setPenalties(response.data);
      } catch (error) {
        console.error("Error fetching penalties:", error);
      }
    } else {
      setPenalties([]);
    }
  };

  const fetchAllPenalties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getAllPenalties");
      setAllPenalties(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching all penalties:", error);
    }
  };

  return (
    <div className="flex">
      <div>
        <Home />
      </div>

      <div className="flex-1 p-10 text-black">
        <h1 className="text-2xl font-bold mb-6">Penalty</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
              Filter By:
            </label>
            <select
              id="filter"
              name="filter"
              value={filter}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="companyName">By Company Name</option>
              <option value="id">By ID</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
              Select Vendor:
            </label>
            <select
              id="vendor"
              name="vendor"
              value={selectedVendor}
              onChange={handleVendorChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={filter === "companyName" ? vendor.vendorCompanyName : vendor.id}>
                  {filter === "companyName" ? vendor.vendorCompanyName : vendor.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button onClick={fetchAllPenalties} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Show All Penalties
          </button>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md" />
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center relative top-[13px]">
            <div className="bg-white p-6 rounded-lg w-3/4">
              <h2 className="text-lg font-bold mb-4">All Penalties</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Penalty ID</th>
                    <th className="border border-gray-300 px-4 py-2">Booking ID</th>
                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredPenalties.length > 0 ? filteredPenalties : allPenalties).map((penalty) => (
                    <tr key={penalty.id}>
                      <td>{penalty.pId}</td>
                      <td>{penalty.booking.bookingId}</td>
                      <td>₹{penalty.amount}</td>
                      <td>{penalty.date}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-200 font-bold">
                    <td colSpan="2">Total Amount</td>
                    <td>₹{(filteredPenalties.length > 0 ? filteredPenalties : allPenalties).reduce((sum, p) => sum + p.amount, 0)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
              <button onClick={() => setShowModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;