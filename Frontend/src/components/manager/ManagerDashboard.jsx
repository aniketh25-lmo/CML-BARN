import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import {
  FaUserCircle, FaEnvelope, FaPhone, FaEdit, FaKey, FaSignOutAlt,
  FaUserPlus, FaUsers, FaTimes, FaChartLine, FaFileExcel, FaCloudSun
} from 'react-icons/fa';
import { FiMessageSquare, FiMenu } from 'react-icons/fi';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const ManagerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [farmerData, setFarmerData] = useState([]);
  const [productionData, setProductionData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch,
    formState: { errors: passwordErrors }
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('managerToken');
    if (token) {
      try {
        const decoded1 = jwtDecode(token);
        const decoded = decoded1.payload || decoded1;
        if (decoded && decoded.name && decoded.email) {
          setUser({
            name: decoded.name,
            email: decoded.email,
            phoneNumber: decoded.phoneNumber,
            google: decoded.isGoogleAccount,
            token
          });
          // console.log("User decoded:", decoded.isGoogleAccount);
        } else {
          navigate('/manager-login');
        }
      } catch (error) {
        navigate('/manager-login');
      }
    } else {
      navigate('/manager-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phoneNumber', user.phoneNumber);
    }
  }, [user, setValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/farmers/get');
        const data = await res.json();
        setFarmerData(data);
      } catch (error) {
        console.error("Error fetching farmer data:", error);
      }
    };

    const fetchProductionData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/production');
        const data = await res.json();
        setProductionData(data);
      } catch (error) {
        console.error("Error fetching production data:", error);
      }
    };

    fetchFarmerData();
    fetchProductionData();
  }, []);

  const cropDistributionData = useMemo(() => {
    const allCrops = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Pulses', 'Other'];
    const cropCounts = Object.fromEntries(allCrops.map(crop => [crop, 0]));

    farmerData.forEach(farmer => {
      farmer.cropsSowing?.forEach(crop => {
        if (crop.name && cropCounts.hasOwnProperty(crop.name)) {
          cropCounts[crop.name]++;
        }
      });
    });

    return Object.entries(cropCounts).map(([name, value]) => ({ name, value }));
  }, [farmerData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666', '#999999'];

  const handleLogout = () => {
    localStorage.removeItem('managerToken');
    navigate('/');
  };

  const onUpdateProfile = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/manager/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: data.name,
          phoneNumber: data.phoneNumber
        })
      });

      const result = await response.json();

      if (response.ok) {
        setUser(prev => ({
          ...prev,
          name: result.manager.name,
          email: result.manager.email,
          phoneNumber: result.manager.phoneNumber
        }));
        alert("Profile updated successfully!");
        setShowEditModal(false);
      } else {
        alert(result.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const onChangePassword = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/manager/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
        resetPasswordForm();
        setShowPasswordModal(false);
      } else {
        alert(result.message || "Password update failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while changing password.");
    }
  };

  const Navbar = () => {
  return (
    <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="font-bold text-xl">Manager Portal</div>

          {/* Middle (hidden on mobile): Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks()}
          </div>

          {/* Right: Profile + Hamburger */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon - always visible */}
            <div className="relative" ref={profileMenuRef}>
              {profileMenu()}
            </div>

            {/* Hamburger Icon - mobile only */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-2xl"
              >
                {isMobileMenuOpen ? <FaTimes /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Links */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-4 pb-4 border-t border-white">
            {navLinks(true)}
          </div>
        )}
      </nav>
    </header>
  );
};


  const navLinks = (isMobile = false) => (
  <>
    <Link to="/farmer-details" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-200 flex items-center text-sm font-medium">
      <FaUsers className="mr-2" /> Farmer Details
    </Link>
    <Link to="/add-farmer" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-200 flex items-center text-sm font-medium">
      <FaUserPlus className="mr-2" /> Add Farmer
    </Link>
    <Link to="/production" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-200 flex items-center text-sm font-medium">
      <FaChartLine className="mr-2" /> Production
    </Link>
    <Link to="/excel" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-200 flex items-center text-sm font-medium">
      <FaFileExcel className="mr-2" /> Excel
    </Link>
    <Link to="/weather-alert" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-200 flex items-center text-sm font-medium">
      <FaCloudSun className="mr-2" /> Weather
    </Link>
    <Link to="/donation-view" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-200 text-sm font-medium">
      💝 Donation
    </Link>
    <Link to="/market-view" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-200 text-sm font-medium">
      🛒 Market
    </Link>
    <Link to="/chat-stream" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-200 flex items-center text-sm font-medium">
      <FiMessageSquare className="mr-2" /> Chat
    </Link>

    {/* Logout button for both desktop and mobile */}
    <div className={`${isMobile ? 'block' : 'hidden md:flex'} mt-2 md:mt-0`}>
      <button
        onClick={() => {
          setIsMobileMenuOpen(false);
          handleLogout();
        }}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center text-sm font-medium"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  </>
);


  const profileMenu = (isMobile = false) => (
    <>
      <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="text-2xl hover:bg-green-700 p-1 rounded-full">
        <FaUserCircle />
      </button>
      {isProfileMenuOpen && (
        <div className={`absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 text-gray-800 ${isMobile ? 'relative mt-2' : ''}`}>
          <div className="px-4 py-2 border-b">
            <p className="font-bold text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              setShowEditModal(true);
              setProfileMenuOpen(false);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
          >
            <FaEdit className="mr-3 text-gray-500" /> Edit Profile
          </button>
          {!user?.google && (  
          <button
            onClick={() => {
              setShowPasswordModal(true);
              setProfileMenuOpen(false);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
          >
            <FaKey className="mr-3 text-gray-500" /> Change Password
          </button>
          )}
        </div>
      )
      }
    </>
  );

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome, {user.name?.split(' ')[0] || 'Manager'}!
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-gray-700 mb-4">Crop Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={cropDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                      {cropDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-gray-700 mb-4">Yearly Production (in Tons)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="production" stroke="#00C49F" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Your Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-800"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input {...register('name', { required: "Name is required" })} className={`mt-1 w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input {...register('email')} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input {...register('phoneNumber')} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" disabled />
              </div>
              <div className="flex justify-end space-x-4 pt-4 mt-4 border-t">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show password modal only if not Google login */}
      {showPasswordModal && !user?.google && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-gray-800"><FaTimes /></button>
            </div>
            <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" {...registerPassword('currentPassword', { required: "Current password is required" })} className={`mt-1 w-full p-2 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                {passwordErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" {...registerPassword('newPassword', { required: "New password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} className={`mt-1 w-full p-2 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                {passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" {...registerPassword('confirmPassword', { required: "Please confirm your password", validate: value => value === watch('newPassword') || "Passwords do not match" })} className={`mt-1 w-full p-2 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                {passwordErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>}
              </div>
              <div className="flex justify-end space-x-4 pt-4 mt-4 border-t">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerDashboard;
