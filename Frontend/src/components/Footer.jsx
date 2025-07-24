import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-8 pb-4 mt-10">
            <div className="max-w-5xl mx-auto flex flex-wrap justify-around">
                {/* Placeholder for logo or brand */}
                <div className="flex-1 min-w-[200px] m-2">
                    <h3 className="text-xl font-bold mb-2">CML's BARN</h3>
                    <p className="text-gray-400">Built during Code for Good 2025 by Team 27 - a MERN + React Native solution for CML to increase income and digitize rural field operations with real-time alerts, role-based dashboards, and mobile data collection.</p>
                </div>
                {/* Placeholder for links */}
                <div className="flex-1 min-w-[200px] m-2">
                    <h4 className="text-lg font-semibold mb-2">Links</h4>
                    <ul className="list-none p-0 m-0 space-y-1">
                        <li>
                            <Link to="/" className="hover:underline text-gray-300">Home</Link>
                        </li>
                        <li>
                            <Link to="/developer-team" className="hover:underline text-gray-300">About</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:underline text-gray-300">Contact</Link>
                        </li>
                    </ul>
                </div>
                {/* Placeholder for contact info */}
                <div className="flex-1 min-w-[200px] m-2">
                    <h4 className="text-lg font-semibold mb-2">Contact</h4>
                    <Link to="/contact" className="hover:underline text-gray-300">Connect via LinkedIn</Link>
                    {/* <p className="text-gray-400">Phone: +1234567890</p> */}
                </div>
            </div>
            <div className="text-center mt-6 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} CML's BARN. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
