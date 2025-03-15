"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../container/components/Navbar";
import * as XLSX from 'xlsx';


const UpdateTripPricing = ({ params }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [dStates, setDStates] = useState([]);
  const [dCities, setDCities] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDState, setSelectedDState] = useState("");
  const [selectedDCity, setSelectedDCity] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [prices, setPrices] = useState({
    hatchback: "",
    sedan: "",
    sedanPremium: "",
    suv: "",
    suvPlus: "",
  });

  const [distance, setDistance] = useState("");
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);

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

    fetch("http://localhost:8080/api/states")
      .then((res) => res.json())
      .then((data) => {
        setStates(data);
        setDStates(data);
      })
      .catch((error) => console.error("Error fetching states:", error));
  }, []);

  useEffect(() => {
    if (selectedCity && selectedDCity && googleMapsLoaded) {
      console.log(
        "Both cities are selected. Proceeding to calculate distance."
      );
      calculateDistance();
    } else {
      if (!selectedCity || !selectedDCity) {
        console.log("Either source city or destination city is not selected.");
      }
      if (!googleMapsLoaded) {
        console.log("Google Maps API not loaded yet.");
      }
    }
  }, [selectedCity, selectedDCity, googleMapsLoaded]);

  const handleStateChange = async (stateId) => {
    setSelectedState(stateId);
    try {
      const response = await fetch(`http://localhost:8080/cities/${stateId}`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleDStateChange = async (stateId) => {
    setSelectedDState(stateId);
    try {
      const response = await fetch(`http://localhost:8080/cities/${stateId}`);
      const data = await response.json();
      setDCities(data);
    } catch (error) {
      console.error("Error fetching destination cities:", error);
    }
  };

  const calculateDistance = () => {
    console.log("Selected City IDs:", selectedCity, selectedDCity);
    const origin = cities.find(
      (city) => city.id.toString() === selectedCity
    )?.name;
    const destination = dCities.find(
      (city) => city.id.toString() === selectedDCity
    )?.name;

    console.log(`Origin: ${origin}, Destination: ${destination}`);

    if (origin && destination && googleMapsLoaded) {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            const calculatedDistance =
              response.rows[0].elements[0].distance.text;
            setDistance(calculatedDistance);
            console.log(`Calculated Distance: ${calculatedDistance}`);
          } else {
            console.error("Error calculating distance:", status);
            setDistance("Error calculating distance");
          }
        }
      );
    } else {
      console.log(
        "Cannot calculate distance. Either origin or destination is missing."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sourceStateName =
      states.find((state) => state.id.toString() === selectedState)?.name || "";
    const sourceCityName =
      cities.find((city) => city.id.toString() === selectedCity)?.name || "";
    const destinationStateName =
      dStates.find((state) => state.id.toString() === selectedDState)?.name ||
      "";
    const destinationCityName =
      dCities.find((city) => city.id.toString() === selectedDCity)?.name || "";

    if (!selectedState || !selectedDState || !selectedDCity || !selectedCity) {
      alert("Please select both source and destination states and cities.");
      return;
    }

    const queryString = new URLSearchParams({
      sourceState: sourceStateName,
      sourceCity: sourceCityName,
      destinationState: destinationStateName,
      destinationCity: destinationCityName,
      hatchbackPrice: prices.hatchback,
      sedanPrice: prices.sedan,
      sedanPremiumPrice: prices.sedanPremium,
      suvPrice: prices.suv,
      suvPlusPrice: prices.suvPlus,
    }).toString();

    const url = `http://localhost:8080/update-prices?${queryString}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to update trip pricing");
      }

      const result = await response.json();
      alert("Trip pricing updated successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
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

  // Submit Excel data to backend
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
      const response = await fetch("http://localhost:8080/upload/excel", {
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

  return (
    <div className="flex">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          One Way Trip Prices Outstation
        </h1>
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
              <label className="block text-sm font-medium">Source State</label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Source City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Destination State
              </label>
              <select
                value={selectedDState}
                onChange={(e) => handleDStateChange(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select State</option>
                {dStates.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Destination City
              </label>
              <select
                value={selectedDCity}
                onChange={(e) => setSelectedDCity(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select City</option>
                {dCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <div>
              {distance ? (
                <div>
                  {
                    cities.find((city) => city.id.toString() === selectedCity)
                      ?.name
                  }{" "}
                  -{" "}
                  {
                    dCities.find((city) => city.id.toString() === selectedDCity)
                      ?.name
                  }{" "}
                  : {distance}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {["hatchback", "sedan", "sedanPremium", "suv", "suvPlus"].map(
                (carType) => (
                  <div key={carType}>
                    <label className="block text-sm font-medium capitalize">
                      {carType.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={prices[carType]}
                      onChange={(e) =>
                        setPrices({ ...prices, [carType]: e.target.value })
                      }
                      className="block w-full p-2 border border-gray-300 rounded"
                    />
                    {prices[carType] && (
                      <div className="mt-2 text-sm text-gray-600">
                        {`${
                          carType.charAt(0).toUpperCase() + carType.slice(1)
                        } Cab`}
                      </div>
                    )}
                    {prices[carType] && distance && (
                      <div className="mt-2 text-sm text-gray-600">
                        Total: {calculateTotal(prices[carType])} (Price *
                        Distance)
                      </div>
                    )}
                  </div>
                )
              )}
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


        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSubmitExcel}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload Excel File
          </button>

          <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        </div>

        {/* Display Parsed Excel Data */}
        {fileData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Uploaded File Data</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-300">Source State</th>
                  <th className="p-2 border border-gray-300">Source City</th>
                  <th className="p-2 border border-gray-300">
                    Destination State
                  </th>
                  <th className="p-2 border border-gray-300">
                    Destination City
                  </th>
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
                    <td className="p-2 border border-gray-300">
                      {row.sourceState}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {row.sourceCity}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {row.destinationState}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {row.destinationCity}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {row.hatchback}
                    </td>
                    <td className="p-2 border border-gray-300">{row.sedan}</td>
                    <td className="p-2 border border-gray-300">
                      {row.sedanpremium}
                    </td>
                    <td className="p-2 border border-gray-300">{row.suv}</td>
                    <td className="p-2 border border-gray-300">
                      {row.suvplus}
                    </td>
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
