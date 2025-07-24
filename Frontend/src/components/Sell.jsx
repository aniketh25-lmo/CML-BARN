import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const Sell = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: '',
    pricePerUnit: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cloudinaryId, setCloudinaryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [aadharNumber, setAadharNumber] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const farmerToken = localStorage.getItem('farmerToken');

  useEffect(() => {
    if (farmerToken) {
      try {
        const decoded = jwtDecode(farmerToken);
        const aadhar = decoded?.aadharNumber || decoded?.payload?.aadharNumber;
        const name = decoded?.name || decoded?.payload?.name || decoded?.fullName;
        if (aadhar) setAadharNumber(aadhar);
        if (name) setFarmerName(name);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, [farmerToken]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/market/all');
        const data = await res.json();
        if (res.ok) setProducts(data);
        else console.error('Failed to fetch products:', data.message);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchProducts();
  }, [loading]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return { secure_url: preview || '', public_id: cloudinaryId || '' };
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const file = await res.json();
    return { secure_url: file.secure_url, public_id: file.public_id };
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageData = { secure_url: preview || '', public_id: cloudinaryId || '' };
      if (imageFile) {
        imageData = await uploadToCloudinary();
      }

      const productData = {
        ...newProduct,
        image: imageData.secure_url,
        cloudinaryId: imageData.public_id,
        aadharNumber,
        farmerName,
      };

      const endpoint = editingProductId
        ? `http://localhost:5000/api/market/update/${editingProductId}`
        : 'http://localhost:5000/api/market/add';

      const res = await fetch(endpoint, {
        method: editingProductId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(editingProductId ? 'Product updated!' : 'Product listed!');
        resetForm();
        setLoading(false);
      } else {
        alert(data.message || 'Failed to submit product');
        setLoading(false);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Operation failed.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProduct({ name: '', category: '', quantity: '', pricePerUnit: '', description: '' });
    setImageFile(null);
    setPreview(null);
    setCloudinaryId(null);
    setEditingProductId(null);
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/market/delete/${productId}`, {
        method: 'DELETE',
      });

      const contentType = res.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (res.ok) {
        alert(data.message || 'Product deleted!');
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Something went wrong while deleting.');
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      pricePerUnit: product.pricePerUnit,
      description: product.description,
    });
    setPreview(product.image);
    setCloudinaryId(product.cloudinaryId || '');
    setEditingProductId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!farmerToken) {
    return <p className="text-red-600 text-center">Access denied. Only farmers can access this page.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">{editingProductId ? 'Edit Product' : 'Sell Product'}</h2>

        <form onSubmit={handleAddOrUpdateProduct} className="bg-white shadow p-6 rounded-lg mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={newProduct.name} onChange={handleChange} placeholder="Product Name" required className="border p-2 rounded" />
            <input name="category" value={newProduct.category} onChange={handleChange} placeholder="Category" required className="border p-2 rounded" />
            <input name="quantity" type="number" value={newProduct.quantity} onChange={handleChange} placeholder="Quantity" required className="border p-2 rounded" />
            <input name="pricePerUnit" type="number" value={newProduct.pricePerUnit} onChange={handleChange} placeholder="Price per unit (₹)" required className="border p-2 rounded" />
            <textarea name="description" value={newProduct.description} onChange={handleChange} placeholder="Description" rows="3" className="border p-2 rounded md:col-span-2" />
            
            <label className="md:col-span-2 flex items-center gap-4 cursor-pointer bg-gray-100 p-2 rounded border border-dashed hover:bg-gray-200">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <span className="text-sm text-gray-700">📷 Click to select an image</span>
            </label>
            
            {preview && <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded" />}
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" disabled={loading}>
              {loading ? 'Saving...' : editingProductId ? 'Update Product' : 'List Product'}
            </button>
            {editingProductId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Cancel
              </button>
            )}
          </div>
        </form>

        <h3 className="text-xl font-semibold mb-4">All Products</h3>
        {products.length === 0 ? (
          <p className="text-center text-gray-600">No products listed so far.</p>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <div key={product._id} className="border rounded p-4 shadow flex gap-4 items-start">
                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ₹{product.pricePerUnit}</p>
                  <p className="text-sm text-gray-600">Description: {product.description}</p>
                  <p className="text-sm text-gray-500">Farmer: {product.farmerName}</p>

                  {String(product.aadharNumber) === String(aadharNumber) && (
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => handleEdit(product)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Sell;
