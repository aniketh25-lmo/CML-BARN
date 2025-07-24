import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const Error = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-100 text-gray-800 text-center p-8">
            <FaExclamationTriangle size={80} className="text-red-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="mb-8 text-lg">
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link
                to="/"
                className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded font-bold text-base transition-colors hover:bg-blue-600"
            >
                <FaHome className="mr-2" />
                Back to Home
            </Link>
        </div>
    );
};

export default Error;
