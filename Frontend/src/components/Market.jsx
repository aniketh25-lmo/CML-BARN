import React, { useEffect, useState } from 'react';
import { FiShoppingCart, FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CLOUDINARY_UPLOAD_PRESET = 'your_preset';
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';

const Market = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: '',
    pricePerUnit: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const farmerToken = localStorage.getItem('farmerToken');
  const managerToken = localStorage.getItem('managerToken');
  const farmerName = localStorage.getItem('farmerName'); // required by backend

  const isFarmer = !!farmerToken;
  const isManager = !!managerToken;

  useEffect(() => {
    fetch('/api/market/all')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return '';
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const file = await res.json();
    return file.secure_url;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary();

      const res = await fetch('/api/market/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          image: imageUrl || '',
          farmerId: 'dummy-farmer-id-or-use-jwt', // optional in backend if token is removed
          farmerName: farmerName || 'Anonymous Farmer',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Product listed successfully!');
        setProducts(prev => [...prev, data]);
        setNewProduct({
          name: '',
          category: '',
          quantity: '',
          pricePerUnit: '',
          description: '',
        });
        setImageFile(null);
        setPreview(null);
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    }
    setLoading(false);
  };

  const handleBuy = async (product) => {
    const name = prompt('Enter your name');
    const email = prompt('Enter your email');
    const address = prompt('Enter delivery address');
    const phone = prompt('Enter phone number');
    const quantity = prompt('How many units do you want to buy?');

    if (!name || !quantity) return;

    try {
      const res = await fetch('/api/market/purchase/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          name,
          email,
          phone,
          address,
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();
      if (res.ok && data.orderId) {
        localStorage.setItem('purchaseData', JSON.stringify({
          ...data,
          productId: product._id,
          quantity,
          name,
          email,
          phone,
        }));
        navigate(`/pay/${data.orderId}`);
      } else {
        alert(data.message || 'Failed to initiate order');
      }
    } catch (err) {
      alert('Error initiating purchase');
      console.error(err);
    }
  };

  const handleStockUpdate = async (productId) => {
    const addUnits = prompt('Enter units to add');
    if (!addUnits || isNaN(addUnits)) return;

    try {
      const res = await fetch(`/api/market/edit/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: parseInt(addUnits) }),
      });

      const updatedProduct = await res.json();
      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p._id === productId ? updatedProduct : p))
        );
        alert('Stock updated');
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Market</h1>

      {isFarmer && (
        <form onSubmit={handleAddProduct} className="bg-white shadow p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Product to Sell</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={newProduct.name} onChange={handleChange} placeholder="Product Name" required className="border p-2 rounded" />
            <input name="category" value={newProduct.category} onChange={handleChange} placeholder="Category" required className="border p-2 rounded" />
            <input name="quantity" type="number" value={newProduct.quantity} onChange={handleChange} placeholder="Quantity" required className="border p-2 rounded" />
            <input name="pricePerUnit" type="number" value={newProduct.pricePerUnit} onChange={handleChange} placeholder="Price per unit (₹)" required className="border p-2 rounded" />
            <textarea name="description" value={newProduct.description} onChange={handleChange} placeholder="Description" rows="3" className="border p-2 rounded md:col-span-2" />
            <input type="file" accept="image/*" onChange={handleImageChange} className="md:col-span-2" />
            {preview && <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded" />}
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" disabled={loading}>
            {loading ? 'Uploading...' : 'List Product'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg p-4 bg-white shadow relative">
            {product.image && (
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            )}
            <h3 className="text-lg font-bold mt-2">{product.name}</h3>
            <p className="text-gray-500">{product.category}</p>
            <p className="text-green-700 font-semibold">₹{product.pricePerUnit} / unit</p>
            <p className="text-sm text-gray-600">Available: {product.quantity}</p>
            <p className="text-sm mt-1">{product.description}</p>
            <p className="text-xs text-gray-400 mt-1">Sold by: {product.farmerName}</p>

            {product.quantity === 0 ? (
              <span className="text-red-600 font-semibold mt-3 block">Sold Out</span>
            ) : (
              !isFarmer && !isManager && (
                <button
                  onClick={() => handleBuy(product)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  <FiShoppingCart className="inline mr-1" />
                  Buy Now
                </button>
              )
            )}

            {isFarmer && (
              <button
                onClick={() => handleStockUpdate(product._id)}
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                <FiPlusCircle className="inline mr-1" />
                Add Stock
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;
