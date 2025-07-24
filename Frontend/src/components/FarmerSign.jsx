import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const FarmerSignup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        aadharNumber: "",
        landArea: "",
        cropSowing: "", // ✅ temporary field for UI dropdown
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Build data structure matching the backend schema
        const payload = {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            aadharNumber: formData.aadharNumber,
            landArea: parseFloat(formData.landArea),
            cropsSowing: formData.cropSowing
                ? [{ name: formData.cropSowing }]
                : [], // backend expects an array of crop objects
        };

        axios.post("http://localhost:5000/api/farmers/farmer-sign", payload, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            console.log("Farmer signed up successfully:", response.data);
            alert("Signup successful!");
            navigate("/farmer-login");
        })
        .catch((error) => {
            console.error("Error signing up farmer:", error.response?.data || error.message);
            alert("Signup failed. Please try again.");
        });
    };

    return (
        <div className="min-h-screen bg-violet-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-violet-800">Farmer Aadhaar Signup</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name (As per Aadhaar)"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        title="Enter a 10-digit phone number"
                        required
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        name="aadharNumber"
                        placeholder="Aadhaar Number"
                        value={formData.aadharNumber}
                        onChange={handleChange}
                        pattern="\d{12}"
                        title="Enter a 12-digit Aadhaar number"
                        required
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        name="landArea"
                        placeholder="Land Area (in acres)"
                        value={formData.landArea}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <select
                        name="cropSowing"
                        value={formData.cropSowing}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded-md sm:col-span-2"
                    >
                        <option value="">Select Crop Sowing</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Rice">Rice</option>
                        <option value="Maize">Maize</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Pulses">Pulses</option>
                        <option value="Other">Other</option>
                    </select>
                    <button
                        type="submit"
                        className="col-span-1 sm:col-span-2 mt-4 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already registered?{" "}
                    <Link to="/farmer-login" className="text-violet-600 underline hover:text-violet-800">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default FarmerSignup;
