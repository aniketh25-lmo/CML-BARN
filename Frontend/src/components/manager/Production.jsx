import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import ManagerNavbar from './ManagerNavbar';

const ProductionDetails = () => {
  const [productions, setProductions] = useState([]);
  const [formData, setFormData] = useState({ year: '', production: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProductions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/production');
      const data = await res.json();
      setProductions(data);
    } catch (error) {
      console.error('Error fetching productions:', error);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { year, production } = formData;

    if (!year || !production) {
      alert('All fields are required');
      return;
    }

    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/production/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('http://localhost:5000/api/production', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      setFormData({ year: '', production: '' });
      setEditingId(null);
      fetchProductions();
    } catch (error) {
      console.error('Error saving production:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({ year: item.year, production: item.production });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await fetch(`http://localhost:5000/api/production/${id}`, {
        method: 'DELETE',
      });
      fetchProductions();
    } catch (error) {
      console.error('Error deleting production:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ year: '', production: '' });
  };

  return (
    <>
      <ManagerNavbar />

      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Production Records</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-4 py-6 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2025"
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Production (tons)</label>
              <input
                type="number"
                name="production"
                value={formData.production}
                onChange={handleChange}
                placeholder="e.g. 10000"
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <FaSave />
              {editingId ? 'Update' : 'Add'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm sm:text-base">
                <th className="px-4 py-2 border">Year</th>
                <th className="px-4 py-2 border">Production (tons)</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                productions.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 text-sm sm:text-base"
                  >
                    <td className="px-4 py-2 border">{item.year}</td>
                    <td className="px-4 py-2 border">{item.production}</td>
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductionDetails;
