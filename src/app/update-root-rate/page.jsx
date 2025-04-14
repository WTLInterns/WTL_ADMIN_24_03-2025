"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../container/components/Navbar";
import * as XLSX from "xlsx";
import axios from "axios";

const UpdateTripPricing = ({ params }) => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [prices, setPrices] = useState({
    hatchback: "",
    sedan: "",
    sedanPremium: "",
    suv: "",
    suvPlus: "",
  });
  const [distance, setDistance] = useState("");
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  // const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [tripData, setTripData] = useState([]); // To display fetched oneWayTrip data if needed

  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyCelDo4I5cPQ72TfCTQW-arhPZ7ALNcp8w&libraries=places";
      script.async = true;
      script.onload = () => {
        setGoogleMapsLoaded(true);
        console.log("Google Maps API loaded");
      };
      document.head.appendChild(script);
    };
    loadGoogleMapsAPI();
  }, []);

  useEffect(() => {
    if (googleMapsLoaded && window.google) {
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(
        pickupRef.current,
        { types: ["geocode"] }
      );
      pickupAutocomplete.addListener("place_changed", () => {
        const place = pickupAutocomplete.getPlace();
        setPickup(place.formatted_address || place.name);
      });

      const dropAutocomplete = new window.google.maps.places.Autocomplete(
        dropRef.current,
        { types: ["geocode"] }
      );
      dropAutocomplete.addListener("place_changed", () => {
        const place = dropAutocomplete.getPlace();
        setDrop(place.formatted_address || place.name);
      });
    }
  }, [googleMapsLoaded]);

  useEffect(() => {
    if (pickup && drop && googleMapsLoaded) {
      console.log("Both pickup and drop locations selected. Calculating distance.");
      calculateDistance();
    } else {
      if (!pickup || !drop) console.log("Either pickup or drop location is not selected.");
      if (!googleMapsLoaded) console.log("Google Maps API not loaded yet.");
    }
  }, [pickup, drop, googleMapsLoaded]);

  const calculateDistance = () => {
    if (pickup && drop && googleMapsLoaded) {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [pickup],
          destinations: [drop],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            const calculatedDistance = response.rows[0].elements[0].distance.text;
            setDistance(calculatedDistance);
            console.log(`Calculated Distance: ${calculatedDistance}`);
          } else {
            console.error("Error calculating distance:", status);
            setDistance("Error calculating distance");
          }
        }
      );
    } else {
      console.log("Cannot calculate distance. Either pickup or drop is missing.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickup || !drop) {
      alert("Please select both pickup and drop locations.");
      return;
    }

   
    const pickupParts = pickup.split(",").map((part) => part.trim());
    const dropParts = drop.split(",").map((part) => part.trim());
    const sourceCity = pickupParts[0] || "";
    const sourceState = pickupParts[1] || "";
    const destinationCity = dropParts[0] || "";
    const destinationState = dropParts[1] || "";

    try {
      const getUrl = `https://api.worldtriplink.com/oneWay2/${encodeURIComponent(pickup)}/${encodeURIComponent(drop)}`;
      const getResponse = await fetch(getUrl);
      let existingTrips = [];
      if (getResponse.ok) {
        existingTrips = await getResponse.json();
      } else {
        console.error("GET request error:", getResponse.status);
      }

      let apiUrl;
      let method;

      if (!existingTrips || existingTrips.length === 0) {
        apiUrl = "https://api.worldtriplink.com/oneprice";
        method = "POST";
      } else {
        apiUrl = "https://api.worldtriplink.com/update-prices";
        method = "PUT";
      }

      const queryParams = new URLSearchParams({
        sourceState: sourceState,
        destinationState: destinationState,
        sourceCity: sourceCity,
        destinationCity: destinationCity,
        hatchbackPrice: prices.hatchback,
        sedanPrice: prices.sedan,
        sedanPremiumPrice: prices.sedanPremium,
        suvPrice: prices.suv,
        suvPlusPrice: prices.suvPlus,
        ...(method === "POST" ? { status: "s" } : {}),
      }).toString();

      const apiUrlWithParams = `${apiUrl}?${queryParams}`;

      const apiResponse = await fetch(apiUrlWithParams, { method });
      if (!apiResponse.ok) {
        throw new Error("API call failed");
      }

      const result = await apiResponse.json();
      alert(method === "POST" ? "Trip pricing created successfully!" : "Trip pricing updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error occurred while processing trip pricing");
    }
  };

  const calculateTotal = (price) => {
    if (!distance || isNaN(price)) return null;
    const numericDistance = parseFloat(distance.replace(/[^\d.-]/g, ""));
    return numericDistance * price;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setFileData(parsedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmitExcel = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    try {
      const response = await fetch("https://api.worldtriplink.com/upload/excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    }
  };

  const [jobs, setJobs] = useState([]);
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("https://api.worldtriplink.com/upload/excel/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const deleteJob = async () => {
    try {
      const res = await axios.delete("https://api.worldtriplink.com/upload/excel/delete");
      alert(res.data);
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file || !startDate || !endDate) {
      alert("Please select file, start date, and end date.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    try {
      const res = await axios.post("https://api.worldtriplink.com/upload/excel", formData);
      alert(res.data);
      fetchJobs();
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Upload failed.");
    }
  };


  return (
    <div className="flex">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">One Way Trip Prices Outstation</h1>
        <div className="card bg-white shadow-md rounded-md mb-6">
          <div className="card-header bg-gray-200 px-4 py-2 rounded-t-md">
            <strong className="text-lg font-semibold flex items-center">
              <i className="mr-2 fa fa-money text-blue-500"></i>
              Update Trip Pricing
              <span className="ml-2 text-xl text-green-500">
                <i className="fa fa-inr"></i>
              </span>
            </strong>
          </div>
          <div className="card-body p-4">
            <div className="flex space-x-2">
              <a
                href="/update-root-rate"
                className="btn btn-secondary text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
              >
                One way Prices
              </a>
              <a
                href="/update-root-rate/roundPrice"
                className="btn btn-secondary text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
              >
                Round Prices
              </a>
              <a
                href="/update-root-rate/rentalPrice"
                className="btn btn-secondary text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
              >
                Rental Prices
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Pickup Location</label>
              <input
                type="text"
                id="pickup"
                ref={pickupRef}
                placeholder="Enter pickup location (e.g., City, State)"
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Drop Location</label>
              <input
                type="text"
                id="drop"
                ref={dropRef}
                placeholder="Enter drop location (e.g., City, State)"
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="pt-2">
            {distance && <div>Distance: {distance}</div>}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {["hatchback", "sedan", "sedanPremium", "suv", "suvPlus"].map((carType) => (
                <div key={carType}>
                  <label className="block text-sm font-medium capitalize">
                    {carType.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={prices[carType]}
                    onChange={(e) => setPrices({ ...prices, [carType]: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded"
                  />
                  {prices[carType] && (
                    <div className="mt-2 text-sm text-gray-600">
                      {`${carType.charAt(0).toUpperCase() + carType.slice(1)} Cab`}
                    </div>
                  )}
                  {prices[carType] && distance && (
                    <div className="mt-2 text-sm text-gray-600">
                      Total: {calculateTotal(prices[carType])} (Price * Distance)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>

        <div className="p-2 max-w-xl ">
  <h2 className="text-2xl font-bold mb-4">Excel Job Manager</h2>
  <form onSubmit={handleFileUpload} className="mb-6 flex items-center space-x-4">
    <input
      type="file"
      accept=".xlsx"
      onChange={(e) => setFile(e.target.files[0])}
      className="block"
    />
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="border rounded p-2"
    />
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="border rounded p-2"
    />
    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
     Schedule File
    </button>
  </form>
  
  <div className="mb-4">
    <h3 className="text-lg font-semibold">Scheduled Jobs</h3>
    {jobs.length === 0 ? (
      <p>No jobs scheduled</p>
    ) : (
      <ul className="list-disc pl-5">
        {jobs.map((job, i) => (
          <li key={i} className="mb-1">
            <strong>{job.jobName}</strong> – Next Fire: {job.nextFireTime}
          </li>
        ))}
      </ul>
    )}
  </div>
  
  {jobs.length > 0 && (
    <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteJob}>
      Delete Job & Excel
    </button>
  )}
</div>



        {fileData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Uploaded File Data</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-300">Pickup Location</th>
                  <th className="p-2 border border-gray-300">Drop Location</th>
                  <th className="p-2 border border-gray-300">Hatchback</th>
                  <th className="p-2 border border-gray-300">Sedan</th>
                  <th className="p-2 border border-gray-300">Sedan Premium</th>
                  <th className="p-2 border border-gray-300">SUV</th>
                  <th className="p-2 border border-gray-300">SUV Plus</th>
                </tr>
              </thead>
              <tbody>
                {fileData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-2 border border-gray-300">{row.pickupLocation}</td>
                    <td className="p-2 border border-gray-300">{row.dropLocation}</td>
                    <td className="p-2 border border-gray-300">{row.hatchback}</td>
                    <td className="p-2 border border-gray-300">{row.sedan}</td>
                    <td className="p-2 border border-gray-300">{row.sedanPremium}</td>
                    <td className="p-2 border border-gray-300">{row.suv}</td>
                    <td className="p-2 border border-gray-300">{row.suvPlus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tripData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">One Way Trip Data</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-300">Pickup Location</th>
                  <th className="p-2 border border-gray-300">Drop Location</th>
                  <th className="p-2 border border-gray-300">Hatchback Price</th>
                  <th className="p-2 border border-gray-300">Sedan Price</th>
                  <th className="p-2 border border-gray-300">Sedan Premium Price</th>
                  <th className="p-2 border border-gray-300">SUV Price</th>
                  <th className="p-2 border border-gray-300">SUV Plus Price</th>
                  <th className="p-2 border border-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {tripData.map((trip, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-2 border border-gray-300">{trip.pickupLocation}</td>
                    <td className="p-2 border border-gray-300">{trip.dropLocation}</td>
                    <td className="p-2 border border-gray-300">{trip.hatchbackPrice}</td>
                    <td className="p-2 border border-gray-300">{trip.sedanPrice}</td>
                    <td className="p-2 border border-gray-300">{trip.sedanPremiumPrice}</td>
                    <td className="p-2 border border-gray-300">{trip.suvPrice}</td>
                    <td className="p-2 border border-gray-300">{trip.suvPlusPrice}</td>
                    <td className="p-2 border border-gray-300">{trip.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default UpdateTripPricing;
