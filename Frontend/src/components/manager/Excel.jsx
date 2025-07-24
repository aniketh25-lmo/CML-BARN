import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ManagerNavbar from './ManagerNavbar';

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchData = async () => {
    const res = await fetch('http://localhost:5000/api/excel');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5000/api/excel/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Upload successful');
      setFile(null);
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/excel/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEditClick = (row) => {
    setEditingRow(row._id);
    setFormData({ ...row });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await fetch(`http://localhost:5000/api/excel/${editingRow}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setEditingRow(null);
    fetchData();
  };

  const handleDownload = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const exportData = data.map(({ _id, __v, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'excel_data_export.xlsx');
  };

  return (
    <>
      <ManagerNavbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Excel File</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="border rounded p-2 w-full sm:w-auto"
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleUpload}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Upload
            </button>
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Download Excel
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">Uploaded Data</h3>

        <div className="overflow-x-auto rounded shadow border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {data[0] &&
                  Object.keys(data[0]).map(
                    (key) =>
                      key !== '_id' && (
                        <th key={key} className="px-4 py-2 text-left whitespace-nowrap">
                          {key}
                        </th>
                      )
                  )}
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={row._id}>
                  {Object.keys(row).map(
                    (key) =>
                      key !== '_id' && (
                        <td key={key} className="px-4 py-2">
                          {editingRow === row._id ? (
                            <input
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            row[key]
                          )}
                        </td>
                      )
                  )}
                  <td className="px-4 py-2 whitespace-nowrap flex flex-col sm:flex-row gap-2">
                    {editingRow === row._id ? (
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(row)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(row._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="100%" className="text-center py-6 text-gray-500">
                    No data uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ExcelUpload;
