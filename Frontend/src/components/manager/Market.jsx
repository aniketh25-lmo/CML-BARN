import React, { useEffect, useState } from 'react';
import ManagerNavbar from './ManagerNavbar';

const MarketView = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:5000/api/market/all'),
          fetch('http://localhost:5000/api/market/orders'),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setProducts(productsData);
        setOrders(ordersData);

        const revenue = ordersData.reduce(
          (total, order) => total + (order.amountPaid || 0),
          0
        );
        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading market view...</p>
      </div>
    );
  }

  return (
    <>
      <ManagerNavbar />
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700">🛍️ Market View</h1>
          <div className="bg-white px-4 py-2 rounded shadow-md text-lg font-semibold text-purple-800 border border-purple-300">
            💰 Total Revenue: ₹{totalRevenue}
          </div>
        </div>

        {/* Products Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-blue-700">🛒 All Products</h2>
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg p-4 border border-gray-200 flex flex-col"
                >
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm"><strong>Category:</strong> {product.category}</p>
                  <p className="text-sm"><strong>Farmer:</strong> {product.farmerName}</p>
                  <p className="text-sm"><strong>Quantity:</strong> {product.quantity}</p>
                  <p className="text-sm"><strong>Price/unit:</strong> ₹{product.pricePerUnit}</p>
                  <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mt-3 w-full h-40 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No products found.</p>
          )}
        </section>

        {/* Orders Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-purple-700">📦 All Orders</h2>
          {orders.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full text-sm md:text-base">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Buyer</th>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2">{order.buyerName}</td>
                      <td className="px-4 py-2">{order.productName}</td>
                      <td className="px-4 py-2">{order.quantityBought}</td>
                      <td className="px-4 py-2">₹{order.amountPaid}</td>
                      <td className="px-4 py-2 text-sm break-all">{order.orderId}</td>
                      <td className="px-4 py-2 text-sm break-all">{order.paymentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No orders found.</p>
          )}
        </section>
      </div>
    </>
  );
};

export default MarketView;
