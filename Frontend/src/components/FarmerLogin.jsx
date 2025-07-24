import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const FarmerLogin = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showOTPField, setShowOTPField] = useState(false);
    const [otp, setotp] = useState("");
    const [loading, setLoading] = useState(false);
    const HARD_CODED_OTP = "123456";

    const handleGenerateOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/farmers/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(`OTP sent successfully to ${phoneNumber}`);
            } else {
                alert(`Backend error: "Failed to send OTP (only available for patricular numbers)"`);
                alert(`Use test OTP: ${HARD_CODED_OTP} to login`);
            }
        } catch (err) {
            console.warn("Backend offline or error. Using fallback OTP.");
            alert(`Backend not responding. Use test OTP: ${HARD_CODED_OTP}`);
        } finally {
            setShowOTPField(true);
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/farmers/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber, otp }),
            });

            const data = await response.json();
            console.log(data)
            if (otp === HARD_CODED_OTP) {
                localStorage.setItem("farmerToken", data.farmerToken);
                // localStorage.setItem("farmerInfo", JSON.stringify(data.farmerInfo));
                alert("Login successful!");
                navigate("/farmer-dashboard"); // Redirect to farmer dashboard
                return;   
            }
            else if (response.ok && data.token) {
                // Store JWT token & farmer info
                localStorage.setItem("farmerToken", data.farmerToken);
                // localStorage.setItem("farmerInfo", JSON.stringify(data.farmerInfo));
                alert("Login successful!");
                navigate("/farmer-dashboard"); // Redirect to farmer dashboard
                return;   
            }
                             
            else {
                alert(data.error || "Invalid OTP");
            }
        } catch (err) {
                alert("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-violet-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-violet-800">Farmer Login</h2>

                <form onSubmit={showOTPField ? handleVerifyOTP : handleGenerateOTP} className="space-y-4">
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        pattern="[0-9]{10}"
                        title="Enter a 10-digit phone number"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />

                    {showOTPField && (
                        <input
                            type="password"
                            name="otp"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setotp(e.target.value)}
                            pattern="\d{6}"
                            title="Enter the 6-digit OTP"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                    >
                        {loading ? "Please wait..." : showOTPField ? "Verify OTP" : "Generate OTP"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/farmer-signup" className="text-violet-600 underline hover:text-violet-800">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default FarmerLogin;
