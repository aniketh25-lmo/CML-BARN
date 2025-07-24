import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGoogle } from 'react-icons/fa';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  reenterPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
});

const ManagerRegister = () => {
  const navigate = useNavigate();
  const googleClientRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onRegisterSubmit = async (data) => {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const hashedReenterPassword = bcrypt.hashSync(data.reenterPassword, 10);

    const submitData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      reenterPassword: hashedReenterPassword,
      phoneNumber: data.phoneNumber,
    };

    try {
      const response = await fetch("http://localhost:5000/api/manager/manager-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const resData = await response.json();
      console.log('✅ Registration Response:', resData);
      alert('Registration successful!');
      navigate('/manager-login');
    } catch (error) {
      console.error('❌ Registration Error:', error);
      alert('Registration failed!');
    }
  };

  const handleGoogleClick = () => {
    if (googleClientRef.current) {
      googleClientRef.current.requestCode();
    }
  };

  useEffect(() => {
    if (window.google && !googleClientRef.current) {
      googleClientRef.current = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'openid email profile',
        ux_mode: 'popup',
        callback: async (response) => {
          try {
            const res = await fetch("http://localhost:5000/api/manager/google-register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: response.code }),
            });

            const result = await res.json();

            if (result.success) {
              localStorage.setItem('managerToken', result.managerToken); // ✅ Store token
              // console.log('✅ Google Auth Response:', result.managerToken);
              alert("Google Registration/Login successful!");
              navigate("/manager-dashboard");
            } else {
              alert("Google registration failed.");
              navigate("/")
            }
          } catch (error) {
            console.error("Google Auth Error:", error);
            alert("Google sign-in failed.");
          }
        },
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Manager Register</h2>

        <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-3">
          {/* Name */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaUser />
            </span>
            <input
              {...register('name')}
              placeholder="Name"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaEnvelope />
            </span>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaLock />
            </span>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Re-enter Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaLock />
            </span>
            <input
              {...register('reenterPassword')}
              type="password"
              placeholder="Re-enter Password"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.reenterPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.reenterPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.reenterPassword.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaPhone />
            </span>
            <input
              {...register('phoneNumber')}
              type="tel"
              placeholder="Phone Number"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm font-medium text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <FaGoogle className="text-blue-500" />
          Continue with Google
        </button>

        {/* Redirect Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Have an account?{' '}
          <Link
            to="/manager-login"
            className="font-medium text-green-600 hover:text-green-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ManagerRegister;
