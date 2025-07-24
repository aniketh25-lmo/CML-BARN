import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ManagerNavbar from './ManagerNavbar';

const cropNameOptions = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Pulses', 'Other'];

const AddFarmer = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      aadharNumber: "",
      cultivationPractices: '',
      landArea: '',
      landUnit: 'acre',
      cropsSowing: [{ name: 'Wheat', quantity: '', unit: 'kg' }],
      livestock: [],
    },
  });

  const { fields: cropFields, append: appendCrop, remove: removeCrop } = useFieldArray({ control, name: 'cropsSowing' });
  const { fields: livestockFields, append: appendLivestock, remove: removeLivestock } = useFieldArray({ control, name: 'livestock' });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/farmers/farmer-sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('managerToken')}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      alert("Farmer added successfully!");
      navigate("/manager-dashboard");

    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <>
      <ManagerNavbar />

      <div className="min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Add New Farmer and Profile</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Basic Info */}
              <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold px-2 text-gray-700">Basic Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                    <input {...register('fullName', { required: true })} placeholder="e.g., Ramesh Kumar" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">Full Name is required.</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                    <input {...register('phoneNumber', { required: true })} placeholder="e.g., 9876543210" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">Phone Number is required.</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600">Aadhaar Number</label>
                    <input {...register('aadharNumber', { required: true })} placeholder="e.g., 123456789012" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    {errors.aadharNumber && <p className="text-red-500 text-xs mt-1">Aadhaar Number is required.</p>}
                  </div>
                </div>
              </fieldset>

              {/* Farming Profile */}
              <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold px-2 text-gray-700">Farming Profile</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Cultivation Practices</label>
                    <input {...register('cultivationPractices')} placeholder="e.g., Organic, Conventional" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-600">Land Area</label>
                      <input type="number" step="0.01" {...register('landArea')} placeholder="e.g., 5.5" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Unit</label>
                      <select {...register('landUnit')} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                        <option value="acre">Acre</option>
                        <option value="hectare">Hectare</option>
                      </select>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Crops Section */}
              <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold px-2 text-gray-700">Crops Sowing</legend>
                <div className="overflow-x-auto">
                  <table className="w-full mt-2 text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2 text-gray-600">Crop Name</th>
                        <th className="text-left p-2 text-gray-600">Quantity</th>
                        <th className="text-left p-2 text-gray-600">Unit</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cropFields.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <select {...register(`cropsSowing.${index}.name`)} className="w-full p-2 border border-gray-300 rounded-md">
                              {cropNameOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                          </td>
                          <td>
                            <input type="number" step="0.01" {...register(`cropsSowing.${index}.quantity`, { required: true })} placeholder="e.g., 50" className="w-full p-2 border border-gray-300 rounded-md" />
                          </td>
                          <td>
                            <input {...register(`cropsSowing.${index}.unit`, { required: true })} placeholder="e.g., kg" className="w-full p-2 border border-gray-300 rounded-md" />
                          </td>
                          <td>
                            <button type="button" onClick={() => removeCrop(index)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="button" onClick={() => appendCrop({ name: 'Wheat', quantity: '', unit: 'kg' })} className="mt-3 flex items-center text-sm text-green-600 hover:text-green-800 font-semibold">
                  <FaPlus className="mr-1" /> Add Another Crop
                </button>
              </fieldset>

              {/* Livestock Section */}
              <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold px-2 text-gray-700">Livestock (Optional)</legend>
                {livestockFields.length === 0 ? (
                  <button type="button" onClick={() => appendLivestock({ type: '', count: '', rearingPractices: '' })} className="text-sm text-green-600 hover:text-green-800 font-semibold flex items-center mt-2">
                    <FaPlus className="mr-1" /> Add Livestock Details
                  </button>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full mt-2 text-sm">
                        <thead>
                          <tr>
                            <th className="text-left p-2 text-gray-600">Type</th>
                            <th className="text-left p-2 text-gray-600">Count</th>
                            <th className="text-left p-2 text-gray-600">Rearing Practices</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {livestockFields.map((item, index) => (
                            <tr key={item.id}>
                              <td><input {...register(`livestock.${index}.type`)} placeholder="e.g., Cow" className="w-full p-2 border border-gray-300 rounded-md" /></td>
                              <td><input type="number" {...register(`livestock.${index}.count`)} placeholder="e.g., 3" className="w-full p-2 border border-gray-300 rounded-md" /></td>
                              <td><input {...register(`livestock.${index}.rearingPractices`)} placeholder="e.g., Free-range" className="w-full p-2 border border-gray-300 rounded-md" /></td>
                              <td><button type="button" onClick={() => removeLivestock(index)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button type="button" onClick={() => appendLivestock({ type: '', count: '', rearingPractices: '' })} className="mt-3 flex items-center text-sm text-green-600 hover:text-green-800 font-semibold">
                      <FaPlus className="mr-1" /> Add More Livestock
                    </button>
                  </>
                )}
              </fieldset>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 border-t pt-6 mt-6">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50">Back</button>
                <button type="submit" className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">Submit Farmer Profile</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFarmer;
