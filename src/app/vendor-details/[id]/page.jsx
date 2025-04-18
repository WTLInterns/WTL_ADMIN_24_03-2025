"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../container/components/Navbar";

const VendorDetails = ({ params }) => {
  const { id } = params;
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchVendorDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/vendors/${id}`);
        const data = await response.json();
        setVendor(data);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      }
      setLoading(false);
    };

    fetchVendorDetails();
  }, [id]);

  return (
    <Navbar>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl flex">
          {/* Left Box: Vendor Details */}
          <div className="w-1/2 p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Vendor Details
            </h2>

            {loading ? (
              <p className="text-gray-500 text-center">Loading...</p>
            ) : vendor ? (
              <div className="border border-gray-200 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {vendor.vendorCompanyName}
                </h3>
                <p className="text-gray-500">{vendor.city}</p>

                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong className="text-gray-900">Contact:</strong>{" "}
                    {vendor.contactNo}
                  </p>
                  <p>
                    <strong className="text-gray-900">
                      Alternate Contact:
                    </strong>{" "}
                    {vendor.alternateMobileNo}
                  </p>
                  <p>
                    <strong className="text-gray-900">Udyog Aadhar:</strong>{" "}
                    {vendor.udyogAadharNo}
                  </p>
                  <p>
                    <strong className="text-gray-900">Email:</strong>{" "}
                    {vendor.vendorEmail}
                  </p>
                  <p>
                    <strong className="text-gray-900">Bank:</strong>{" "}
                    {vendor.bankName}
                  </p>
                  <p>
                    <strong className="text-gray-900">Account No:</strong>{" "}
                    {vendor.bankAccountNo}
                  </p>
                  <p>
                    <strong className="text-gray-900">IFSC Code:</strong>{" "}
                    {vendor.ifscCode}
                  </p>
                  <p>
                    <strong className="text-gray-900">Aadhar No:</strong>{" "}
                    {vendor.aadharNo}
                  </p>
                  <p>
                    <strong className="text-gray-900">PAN No:</strong>{" "}
                    {vendor.panNo}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-500 text-center">Vendor not found!</p>
            )}

            <button
              className="mt-6 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-all shadow-md"
              onClick={() => router.push("/vendors/all-vendors")}
            >
              Back to Vendors
            </button>
          </div>

          {/* Right Box: Vendor Image & Documents */}
          <div className="w-1/2 flex flex-col items-center">
            <img
              src={`http://localhost:8080${vendor?.vendorImage}`}
              alt="Vendor"
              className="w-40 h-40 object-cover rounded-lg shadow-md"
            />
            <div className="mt-6 space-y-4 w-full">
              <a
                href={`http://localhost:8080${vendor?.panPhoto}`}
                target="_blank"
                className="block w-full bg-green-600 text-white text-center py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
              >
                View PAN
              </a>
              <a
                href={`http://localhost:8080${vendor?.aadharPhoto}`}
                target="_blank"
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
              >
                View Aadhar
              </a>
              <a
                href={`http://localhost:8080${vendor?.govtApprovalCertificate}`}
                target="_blank"
                className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all"
              >
                View Govt Certificate
              </a>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default VendorDetails;

// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Navbar from "../../../container/components/Navbar";

// const VendorDetails = ({ params }) => {
//   const { id } = params;
//   const [vendor, setVendor] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchVendorDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`http://localhost:8080/vendors/${id}`); // Replace with actual API endpoint
//         const data = await response.json();
//         setVendor(data);
//       } catch (error) {
//         console.error('Error fetching vendor details:', error);
//       }
//       setLoading(false);
//     };

//     fetchVendorDetails();
//   }, [id]);

//   // Static Data for Testing
//   const staticVendors = [
//     {
//       id: 1, name: 'Test', contact: '9663474741', city: 'Pune',
//       udyogAadhar: '0987654323456', email: 'asto99999999@gmail.com',
//       bank: 'Canara Bank', adhar: '0987654323456',
//       image: 'https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg',
//       pan: '/docs/pan1.pdf',
//       aadhar: '/docs/aadhar1.pdf',
//       govCertificate: '/docs/gov-cert1.pdf'
//     },
//     {
//       id: 2, name: 'Snehal Travels PVT Ltd', contact: '9865656325', city: 'Mulki',
//       udyogAadhar: 'UDYAM-XX-00-0000000', email: 'snehalbagale72@gmail.com',
//       bank: 'ICIC Bank', adhar: '856498753656',
//       image: 'https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg',
//       pan: '/docs/pan2.pdf',
//       aadhar: '/docs/aadhar2.pdf',
//       govCertificate: '/docs/gov-cert2.pdf'
//     },
//     {
//       id: 3, name: 'AimCab', contact: '9960969737', city: 'Pune',
//       udyogAadhar: 'UDYAM-MH-26-0478951', email: 'adabbagwan@gmail.com',
//       bank: 'ICIC Bank', adhar: '290186131526',
//       image: 'https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg',
//       pan: '/docs/pan3.pdf',
//       aadhar: '/docs/aadhar3.pdf',
//       govCertificate: '/docs/gov-cert3.pdf'
//     },
//   ];

//   useEffect(() => {
//     if (!vendor) {
//       const foundVendor = staticVendors.find((v) => v.id === Number(id));
//       if (foundVendor) setVendor(foundVendor);
//     }
//   }, [id, vendor]);

//   return (
//     <Navbar>
//       <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
//         <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl flex">

//           {/* Left Box: Vendor Details */}
//           <div className="w-1/2 p-6">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Vendor Details</h2>

//             {loading ? (
//               <p className="text-gray-500 text-center">Loading...</p>
//             ) : vendor ? (
//               <div className="border border-gray-200 p-6 rounded-lg space-y-4">
//                 <h3 className="text-xl font-semibold text-gray-900">{vendor.name}</h3>
//                 <p className="text-gray-500">{vendor.city}</p>

//                 <div className="space-y-3 text-gray-700">
//                   <p><strong className="text-gray-900">Contact:</strong> {vendor.contact}</p>
//                   <p><strong className="text-gray-900">Udyog Aadhar:</strong> {vendor.udyogAadhar}</p>
//                   <p><strong className="text-gray-900">Email:</strong> {vendor.email}</p>
//                   <p><strong className="text-gray-900">Bank:</strong> {vendor.bank}</p>
//                   <p><strong className="text-gray-900">Aadhar:</strong> {vendor.adhar}</p>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-red-500 text-center">Vendor not found!</p>
//             )}

//             <button
//               className="mt-6 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-all shadow-md"
//               onClick={() => router.push('/vendors/all-vendors')}
//             >
//               Back to Vendors
//             </button>
//           </div>

//           {/* Right Box: Vendor Image & Documents */}
//           <div className="w-1/2 flex flex-col items-center">
//             <img
//               src={vendor?.image}
//               alt="Vendor"
//               className="w-40 h-40 object-cover rounded-lg shadow-md"
//             />
//             <div className="mt-6 space-y-4 w-full">
//               <a
//                 href={vendor?.pan}
//                 target="_blank"
//                 className="block w-full bg-green-600 text-white text-center py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
//               >
//                 View PAN
//               </a>
//               <a
//                 href={vendor?.aadhar}
//                 target="_blank"
//                 className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
//               >
//                 View Aadhar
//               </a>
//               <a
//                 href={vendor?.govCertificate}
//                 target="_blank"
//                 className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all"
//               >
//                 View Govt Certificate
//               </a>
//             </div>
//           </div>

//         </div>
//       </div>
//     </Navbar>
//   );
// };

// export default VendorDetails;
