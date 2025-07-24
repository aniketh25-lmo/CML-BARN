import React, { useEffect, useState } from 'react';
import ManagerNavbar from './ManagerNavbar';

const DonationView = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/payment/all-donations');
        const data = await res.json();
        setDonations(data);
        const total = data.reduce((sum, donation) => sum + (donation.amount || 0), 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">Loading donations...</div>;
  }

  return (
    <>
      <ManagerNavbar />
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700">🎁 Donations Received</h1>
          <div className="bg-white px-4 py-2 rounded shadow-md text-base md:text-lg font-semibold text-purple-800 border border-purple-300 text-center">
            💰 Total Donations: ₹{totalAmount}
          </div>
        </div>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-blue-700">📋 All Donations</h2>
          <div className="overflow-x-auto rounded-md shadow-md">
            {donations.length > 0 ? (
              <table className="min-w-[700px] w-full bg-white">
                <thead className="bg-gray-200 text-gray-700 text-sm md:text-base">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Contact</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Payment ID</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id} className="border-b text-sm md:text-base">
                      <td className="px-4 py-2">{donation.name}</td>
                      <td className="px-4 py-2">{donation.email}</td>
                      <td className="px-4 py-2">{donation.contact}</td>
                      <td className="px-4 py-2 font-medium text-green-700">₹{donation.amount}</td>
                      <td className="px-4 py-2 break-all">{donation.orderId}</td>
                      <td className="px-4 py-2 break-all">{donation.paymentId}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {new Date(donation.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No donations found.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default DonationView;
