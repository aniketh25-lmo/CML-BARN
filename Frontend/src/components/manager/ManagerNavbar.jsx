import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBars, FaTimes, FaSignOutAlt, FaUserPlus, FaUsers, FaChartLine,
  FaFileExcel, FaCloudSun, FaHome
} from 'react-icons/fa';
import { FiMessageSquare } from 'react-icons/fi';

const ManagerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('managerToken');
    navigate('/');
  };

  return (
    <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand + Toggle Button */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="font-bold text-xl">Manager Portal</div>

            <div className="md:hidden">
              <button
                onClick={handleToggle}
                className="text-white focus:outline-none"
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/manager-dashboard" className="hover:text-gray-200 flex items-center text-sm font-medium">
              <FaHome className="mr-2" /> Home
            </Link>
            <Link to="/farmer-details" className="hover:text-gray-200 flex items-center text-sm font-medium">
              <FaUsers className="mr-2" /> Farmer Details
            </Link>
            <Link to="/add-farmer" className="hover:text-gray-200 flex items-center text-sm font-medium">
              <FaUserPlus className="mr-2" /> Add Farmer
            </Link>
            <Link to="/production" className="hover:text-gray-200 flex items-center text-sm font-medium">
              <FaChartLine className="mr-2" /> Production
            </Link>
            <Link to="/excel" className="hover:text-gray-200 flex items-center text-sm font-medium">
              <FaFileExcel className="mr-2" /> Excel
            </Link>
            <Link to="/weather-alert" className="hover:text-gray-200 flex items-center text-sm font-medium">
              <FaCloudSun className="mr-2" /> Weather
            </Link>
            <Link to="/donation-view" className="hover:text-gray-200 flex items-center text-sm font-medium">
              💝 <span className="ml-1">Donation</span>
            </Link>
            <Link to="/market-view" className="hover:text-gray-200 flex items-center text-sm font-medium">
              🛒 <span className="ml-1">Market</span>
            </Link>
            <Link to="/chat-stream" className="hover:text-gray-200 flex items-center text-sm font-medium">
              <FiMessageSquare className="mr-2" /> Chat
            </Link>
          </div>

          {/* Always-visible Logout Button */}
          <div className="hidden md:flex">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center text-sm font-medium"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            <Link to="/manager-dashboard" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              <FaHome className="inline mr-2" /> Home
            </Link>
            <Link to="/farmer-details" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              <FaUsers className="inline mr-2" /> Farmer Details
            </Link>
            <Link to="/add-farmer" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              <FaUserPlus className="inline mr-2" /> Add Farmer
            </Link>
            <Link to="/production" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              <FaChartLine className="inline mr-2" /> Production
            </Link>
            <Link to="/excel" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              <FaFileExcel className="inline mr-2" /> Excel
            </Link>
            <Link to="/weather-alert" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              <FaCloudSun className="inline mr-2" /> Weather
            </Link>
            <Link to="/donation-view" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              💝 <span className="ml-1">Donation</span>
            </Link>
            <Link to="/market-view" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              🛒 <span className="ml-1">Market</span>
            </Link>
            <Link to="/chat-stream" onClick={handleToggle} className="block hover:text-gray-200 text-sm font-medium">
              <FiMessageSquare className="inline mr-2" /> Chat
            </Link>
            {/* Mobile Logout Button */}
            <button
              onClick={() => {
                handleToggle();
                handleLogout();
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center text-sm font-medium w-full"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default ManagerNavbar;
