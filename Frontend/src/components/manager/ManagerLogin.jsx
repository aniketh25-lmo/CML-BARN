import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const schema = yup.object().shape({
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const ManagerLogin = () => {
  const navigate = useNavigate();
  const googleClientRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onLoginSubmit = async (data) => {
  try {
    // Check if admin login based on email from .env
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    if (data.email === adminEmail) {
      // Send to backend for password verification
      const adminResponse = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const adminResult = await adminResponse.json();

      if (adminResponse.ok && adminResult.adminToken) {
        const adminUserData = {
          name: 'Administrator',
          email: data.email,
          role: 'admin',
        };
        localStorage.setItem('user', JSON.stringify(adminUserData));
        localStorage.setItem('adminToken', adminResult.adminToken);
        alert('Administrator login successful!');
        navigate('/admin-dashboard');
        return;
      } else {
        alert(adminResult.message || 'Invalid admin credentials.');
        return;
      }
    }

    // Manager login flow
    const response = await fetch('http://localhost:5000/api/manager/manager-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.managerToken) {
      localStorage.setItem('managerToken', result.managerToken);
      alert('Login successful!');
      navigate('/manager-dashboard');
    } else {
      alert(result.message || 'Login failed. Please check your credentials.');
      navigate("/")
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Something went wrong. Please try again later.');
  }
};

  const handleGoogleLogin = () => {
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
        redirect_uri: 'postmessage',
        callback: async (response) => {
          try {
            const res = await fetch('http://localhost:5000/api/manager/google-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: response.code }),
            });

            const result = await res.json();

            if (result.success) {
              localStorage.setItem('managerToken', result.managerToken);
              alert('Google login successful!');
              navigate('/manager-dashboard');
            } else {
              alert(result.message || 'Google login failed.');
              navigate("/")
            }
          } catch (error) {
            console.error('Google Auth Error:', error);
            alert('Google sign-in failed. Try again.');
          }
        },
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Manager Login</h2>

        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaEnvelope className="text-gray-400" />
            </span>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" />
            </span>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div />
            <Link
              to="/forgot-password"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 !mt-4"
          >
            Login
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm font-medium text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <FaGoogle className="text-blue-500" />
          Sign in with Google
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          Manager?{' '}
          <Link to="/manager-register" className="font-medium text-green-600 hover:text-green-700 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ManagerLogin;
