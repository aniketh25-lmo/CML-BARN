// Same import section
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  FaSearch, FaEdit, FaTrash, FaBell, FaUserPlus
} from 'react-icons/fa';
import ManagerNavbar from './ManagerNavbar';

const FarmerDetails = () => {
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [farmerToDelete, setFarmerToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [farmerToAlert, setFarmerToAlert] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editFarmerData, setEditFarmerData] = useState(null);

  const { register, handleSubmit, reset, control } = useForm();
  const { fields: cropFields, append: appendCrop, remove: removeCrop } = useFieldArray({ control, name: "cropsSowing" });
  const { fields: livestockFields, append: appendLivestock, remove: removeLivestock } = useFieldArray({ control, name: "livestock" });

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/farmers/get');
        const data = await res.json();
        setFarmers(data);
        setFilteredFarmers(data);
      } catch (err) {
        console.error('Error fetching farmers');
      }
    };
    fetchFarmers();
  }, []);

  useEffect(() => {
    let result = farmers;
    if (searchTerm) {
      result = result.filter(farmer =>
        farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.phoneNumber.includes(searchTerm) ||
        farmer.aadharNumber.includes(searchTerm)
      );
    }
    if (cropFilter !== 'All') {
      result = result.filter(farmer => farmer.cropsSowing.some(crop => crop.name === cropFilter));
    }
    setFilteredFarmers(result);
  }, [searchTerm, cropFilter, farmers]);

  const handleCheckboxChange = (farmer) => {
    setSelectedFarmers(prev =>
      prev.some(f => f.aadharNumber === farmer.aadharNumber)
        ? prev.filter(f => f.aadharNumber !== farmer.aadharNumber)
        : [...prev, farmer]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFarmers([]);
    } else {
      setSelectedFarmers(filteredFarmers);
    }
    setSelectAll(!selectAll);
  };

  const handleSendAlertClick = (farmer = null) => {
    setBulkMode(!farmer);
    setFarmerToAlert(farmer);
    setAlertMessage('');
    setShowAlertModal(true);
  };

  const sendAlert = async () => {
    if (!alertMessage.trim()) return alert("Please enter a message.");
    const payload = bulkMode
      ? { phoneNumbers: selectedFarmers.map(f => f.phoneNumber), message: alertMessage }
      : { phoneNumber: farmerToAlert.phoneNumber, message: alertMessage };
    try {
      const res = await fetch(`http://localhost:5000/api/farmers/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      alert("Alert sent successfully!");
      setShowAlertModal(false);
      setSelectedFarmers([]);
      setSelectAll(false);
    } catch (err) {
      alert("Failed to send alert");
    }
  };

  const handleDeleteClick = (farmer) => {
    setFarmerToDelete(farmer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/farmers/delete/${farmerToDelete.aadharNumber}`, {
        method: 'DELETE'
      });
      setFarmers(prev => prev.filter(f => f.aadharNumber !== farmerToDelete.aadharNumber));
      setShowDeleteModal(false);
      setFarmerToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (farmer) => {
    setEditFarmerData(farmer);
    reset(farmer);
    setShowEditModal(true);
  };

  const submitEdit = async (data) => {
    try {
      const res = await fetch(`http://localhost:5000/api/farmers/update/${editFarmerData.aadharNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setFarmers(prev => prev.map(f => f.aadharNumber === updated.aadharNumber ? updated : f));
      setShowEditModal(false);
      setEditFarmerData(null);
      alert("Farmer updated!");
    } catch (err) {
      alert("Update failed.");
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowAlertModal(false);
    setFarmerToAlert(null);
    setBulkMode(false);
    reset();
  };

  const uniqueCrops = ['All', ...new Set(farmers.flatMap(f => f.cropsSowing.map(c => c.name)))];

  return (
    <>
      <ManagerNavbar />
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Farmer Details</h2>
            <div className="flex flex-wrap gap-2">
              <Link to="/add-farmer" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm md:text-base">
                <FaUserPlus className="inline-block mr-1" /> Add Farmer
              </Link>
              <button
                onClick={() => handleSendAlertClick(null)}
                disabled={selectedFarmers.length === 0}
                className={`bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm md:text-base ${selectedFarmers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaBell className="inline-block mr-1" />
                Send Bulk Alert ({selectedFarmers.length})
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full">
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
                placeholder="Search by name, phone, or Aadhaar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="border p-2 rounded-md text-sm"
            >
              {uniqueCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
            </select>
          </div>

          {/* Farmer Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Aadhaar</th>
                  <th className="p-3 text-left">Land</th>
                  <th className="p-3 text-left">Crops</th>
                  <th className="p-3 text-left">Livestock</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map(farmer => (
                  <tr key={farmer.aadharNumber} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedFarmers.some(f => f.aadharNumber === farmer.aadharNumber)}
                        onChange={() => handleCheckboxChange(farmer)}
                      />
                    </td>
                    <td className="p-3">{farmer.fullName}</td>
                    <td className="p-3">{farmer.phoneNumber}</td>
                    <td className="p-3">{farmer.aadharNumber}</td>
                    <td className="p-3">{farmer.landArea} {farmer.landUnit}</td>
                    <td className="p-3">
                      {farmer.cropsSowing.map((c, i) => (
                        <div key={i}>{c.name} ({c.quantity} {c.unit})</div>
                      ))}
                    </td>
                    <td className="p-3">
                      {farmer.livestock?.map((l, i) => (
                        <div key={i}>{l.type} - {l.count} ({l.rearingPractices})</div>
                      ))}
                    </td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => handleEditClick(farmer)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                      <button onClick={() => handleDeleteClick(farmer)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                      <button onClick={() => handleSendAlertClick(farmer)} className="text-yellow-600 hover:text-yellow-800"><FaBell /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         {/* Alert, Delete and Edit modals below */}
          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Edit Farmer</h3>
                <form onSubmit={handleSubmit(submitEdit)} className="space-y-3">
                  <input {...register("fullName")} placeholder="Full Name" className="w-full border p-2 rounded" />
                  <input {...register("phoneNumber")} placeholder="Phone Number" className="w-full border p-2 rounded" />
                  <input {...register("aadharNumber")} placeholder="Aadhaar Number" className="w-full border p-2 rounded" />
                  <input {...register("landArea")} placeholder="Land Area" className="w-full border p-2 rounded" />
                  <input {...register("landUnit")} placeholder="Land Unit" className="w-full border p-2 rounded" />

                  {/* Crops */}
                  <h4 className="mt-4 font-semibold">Crops Sowing</h4>
                  {cropFields.map((item, index) => (
                    <div key={item.id} className="flex gap-2 mb-2">
                      <input {...register(`cropsSowing.${index}.name`)} placeholder="Crop Name" className="w-1/3 border p-2 rounded" />
                      <input {...register(`cropsSowing.${index}.quantity`)} placeholder="Quantity" className="w-1/3 border p-2 rounded" />
                      <input {...register(`cropsSowing.${index}.unit`)} placeholder="Unit" className="w-1/4 border p-2 rounded" />
                      <button type="button" onClick={() => removeCrop(index)} className="text-red-600">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendCrop({ name: '', quantity: '', unit: '' })} className="text-blue-600 text-sm underline">+ Add Crop</button>

                  {/* Livestock */}
                  <h4 className="mt-4 font-semibold">Livestock</h4>
                  {livestockFields.map((item, index) => (
                    <div key={item.id} className="flex gap-2 mb-2">
                      <input {...register(`livestock.${index}.type`)} placeholder="Type" className="w-1/3 border p-2 rounded" />
                      <input {...register(`livestock.${index}.count`)} placeholder="Count" className="w-1/4 border p-2 rounded" />
                      <input {...register(`livestock.${index}.rearingPractices`)} placeholder="Practices" className="w-1/2 border p-2 rounded" />
                      <button type="button" onClick={() => removeLivestock(index)} className="text-red-600">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendLivestock({ type: '', count: '', rearingPractices: '' })} className="text-blue-600 text-sm underline">+ Add Livestock</button>

                  <div className="flex justify-end gap-4 mt-4">
                    <button onClick={closeModal} type="button" className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Alert Modal */}
          {showAlertModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold">{bulkMode ? "Send Bulk Alert" : "Send Alert"}</h3>
                <p className="my-2 text-sm text-gray-600">
                  {bulkMode ? `To: ${selectedFarmers.length} farmers` : `To: ${farmerToAlert?.fullName}`}
                </p>
                <textarea
                  className="w-full border p-2 rounded h-24 resize-none"
                  placeholder="Enter your alert message..."
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                />
                <div className="flex justify-end gap-4 mt-4">
                  <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                  <button onClick={sendAlert} className="px-4 py-2 bg-yellow-600 text-white rounded">Send</button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Confirm Delete</h3>
                <p>Are you sure you want to delete farmer: <strong>{farmerToDelete?.fullName}</strong>?</p>
                <div className="flex justify-end gap-4 mt-4">
                  <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                  <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmerDetails;
