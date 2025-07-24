import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaUserShield,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('user'));

  const [managers, setManagers] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    isAuthorized: false,
  });

  useEffect(() => {
    if (!admin || admin.role !== 'admin') {
      alert('Unauthorized access');
      navigate('/manager-login');
    } else {
      fetchManagers();
    }
  }, [admin, navigate]);

  const fetchManagers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/manager/get-all-managers');
      const data = await response.json();

      if (Array.isArray(data)) {
        setManagers(data);
      } else if (Array.isArray(data.managers)) {
        setManagers(data.managers);
      } else {
        console.error('Unexpected response format:', data);
        setManagers([]);
      }
    } catch (err) {
      console.error('Failed to fetch managers', err);
      setManagers([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleEdit = (manager) => {
    setEditMode(manager._id);
    setFormData({
      name: manager.name,
      email: manager.email,
      phoneNumber: manager.phoneNumber || '',
      isAuthorized: manager.isAuthorized || false,
    });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/manager/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditMode(null);
        fetchManagers();
      }
    } catch (err) {
      console.error('Failed to update manager', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this manager?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/manager/delete/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchManagers();
    } catch (err) {
      console.error('Failed to delete manager', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaUserShield className="text-blue-600" />
            Welcome, {admin?.name}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        <h2 className="text-lg font-bold mb-4 text-gray-700">Manage Managers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead className="bg-gray-200 text-gray-600 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Authorized</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager._id} className="border-t">
                  <td className="p-3">
                    {editMode === manager._id ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      manager.name
                    )}
                  </td>
                  <td className="p-3">
                    {editMode === manager._id ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      manager.email
                    )}
                  </td>
                  <td className="p-3">
                    {editMode === manager._id ? (
                      <input
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      manager.phoneNumber || '-'
                    )}
                  </td>
                  <td className="p-3">
                    {editMode === manager._id ? (
                      <select
                        value={formData.isAuthorized ? 'true' : 'false'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isAuthorized: e.target.value === 'true',
                          })
                        }
                        className="border p-1 rounded w-full"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      manager.isAuthorized ? 'Yes' : 'No'
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    {editMode === manager._id ? (
                      <button
                        onClick={() => handleSave(manager._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(manager)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(manager._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {managers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No managers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
