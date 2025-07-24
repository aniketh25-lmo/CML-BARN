import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-green-600 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Home Icon on the Left */}
          <div className="flex-shrink-0 text-white text-2xl">
            <Link to="/">
              <FaHome className="hover:text-yellow-300 transition duration-200" />
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 text-white items-center">
            <Link
              to="/manager-register"
              className="hover:text-yellow-300 transition duration-200 text-lg font-medium"
            >
              Manager
            </Link>
            <Link
              to="/farmer-signup"
              className="hover:text-yellow-300 transition duration-200 text-lg font-medium"
            >
              Farmers
            </Link>
            <Link
              to="/market"
              className="hover:text-yellow-300 transition duration-200 text-lg font-medium"
            >
              Market
            </Link>
            <Link
              to="/developer-team"
              className="hover:text-yellow-300 transition duration-200 text-lg font-medium"
            >
              Meet Our Developer Team
            </Link>
            <Link
              to="/contact"
              className="hover:text-yellow-300 transition duration-200 text-lg font-medium"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 text-white">
            <Link
              to="/manager-register"
              className="block hover:text-yellow-300 text-lg font-medium"
              onClick={toggleMenu}
            >
              Manager
            </Link>
            <Link
              to="/farmer-signup"
              className="block hover:text-yellow-300 text-lg font-medium"
              onClick={toggleMenu}
            >
              Farmers
            </Link>
            <Link
              to="/market"
              className="block hover:text-yellow-300 text-lg font-medium"
              onClick={toggleMenu}
            >
              Market
            </Link>
            <Link
              to="/developer-team"
              className="block hover:text-yellow-300 text-lg font-medium"
              onClick={toggleMenu}
            >
              Meet Our Developer Team
            </Link>
            <Link
              to="/contact"
              className="block hover:text-yellow-300 text-lg font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
