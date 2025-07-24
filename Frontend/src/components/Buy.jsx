import React, { useEffect, useState } from 'react';

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerAddress: '',
    phoneNumber: '',
    quantityBought: 1,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    fetch('http://localhost:5000/api/market/all')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to load products. Please try again later.');
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setFormData((prev) => ({ ...prev, quantityBought: 1 }));
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { quantityBought } = formData;
    const quantity = parseInt(quantityBought);
    const available = selectedProduct.quantity;

    // ✅ Validate quantity
    if (!quantity || quantity < 1) {
      setError('Quantity must be at least 1.');
      setLoading(false);
      return;
    }

    if (quantity > available) {
      setError(`Only ${available} units available. Please reduce quantity.`);
      setLoading(false);
      return;
    }

    const amountPaid = quantity * selectedProduct.pricePerUnit;

    try {
      // ✅ Create Razorpay Order
      const res = await fetch('http://localhost:5000/api/market/purchase/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountPaid * 100 }), // in paisa
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create payment order');
      }

      const data = await res.json();
      const orderId = data.id;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amountPaid * 100,
        currency: 'INR',
        name: selectedProduct.name,
        description: `Buying ${quantity} unit(s)`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // ✅ Save Order and update product quantity
            const orderRes = await fetch('http://localhost:5000/api/market/purchase/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...formData,
                sellerName: selectedProduct.farmerName,
                productName: selectedProduct.name,
                quantityBought: quantity,
                amountPaid,
                orderId,
                paymentId: response.razorpay_payment_id,
              }),
            });

            if (!orderRes.ok) {
              const err = await orderRes.json();
              throw new Error(err.message || 'Failed to save order');
            }

            alert('✅ Order placed successfully!');

            // ✅ Refresh product list
            const updated = await fetch('http://localhost:5000/api/market/all');
            const updatedData = await updated.json();
            setProducts(Array.isArray(updatedData) ? updatedData : updatedData.products || []);

            // Reset form
            setSelectedProduct(null);
            setFormData({
              buyerName: '',
              buyerEmail: '',
              buyerAddress: '',
              phoneNumber: '',
              quantityBought: 1,
            });
          } catch (err) {
            console.error('Order save error:', err);
            setError(err.message || 'Something went wrong while saving order.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.buyerName,
          email: formData.buyerEmail,
          contact: formData.phoneNumber,
        },
        theme: { color: '#0c8f55' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(response.error.description || 'Payment failed.');
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'Payment failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      {selectedProduct && (
        <div className="mb-8 p-6 bg-white border-l-4 border-green-500 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-700">
            🛒 Buying: {selectedProduct.name}
          </h2>
          <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="p-3 border rounded-md"
              disabled={loading}
            />
            <input
              type="email"
              name="buyerEmail"
              value={formData.buyerEmail}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="p-3 border rounded-md"
              disabled={loading}
            />
            <input
              type="text"
              name="buyerAddress"
              value={formData.buyerAddress}
              onChange={handleChange}
              placeholder="Your Address"
              required
              className="p-3 border rounded-md"
              disabled={loading}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="p-3 border rounded-md"
              disabled={loading}
            />
            <input
              type="number"
              name="quantityBought"
              min="1"
              value={formData.quantityBought}
              onChange={handleChange}
              max={selectedProduct.quantity}
              className="p-3 border rounded-md col-span-1 md:col-span-2"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="col-span-1 md:col-span-2 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : `Pay ₹${formData.quantityBought * selectedProduct.pricePerUnit}`}
            </button>
            {error && (
              <p className="col-span-2 text-red-600 font-medium mt-2">{error}</p>
            )}
          </form>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-gray-800">🌾 Available Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products listed so far.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Category: {product.category}</p>
                <p className="text-sm mt-1">💰 ₹{product.pricePerUnit} per unit</p>
                <p className="text-sm mt-1">📦 In stock: {product.quantity}</p>
                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => handleBuyClick(product)}
                  disabled={product.quantity <= 0}
                >
                  {product.quantity > 0 ? 'Buy Now' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Buy;
