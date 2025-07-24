import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero.jpg";
import impact1 from "../assets/impact.jpg";
import impact2 from "../assets/goal.jpg";
import impact3 from "../assets/mission.jpg";
import team1 from "../assets/team1.png";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";
import team4 from "../assets/team4.jpg";
// import PaymentServices from "./PaymentServices";
import Market from "./Market";
import Subsidiary from '../components/Subsidiary';

export default function Home() {
  const [formVisible, setFormVisible] = useState(true);
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();
  const donationRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 300) {
      alert("Minimum donation amount is ₹300.");
      return;
    }

    setFormVisible(false);
    navigate("/payment", { state: { amount: Number(amount) } });

    setTimeout(() => {
      setFormVisible(true);
    }, 2000);
  };

  return (
    <main className="bg-gradient-to-br from-indigo-100 via-blue-50 to-green-100 text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-800 via-blue-700 to-green-400 relative overflow-hidden">
        <img
          src={heroBg}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-blue-800/60 to-green-400/40 z-10"></div>
        <div className="container mx-auto px-6 text-center relative z-20 flex flex-col items-center justify-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-2 text-white drop-shadow-lg">
            Centre for Microfinance and Livelihood's BARN
          </h1>
          <p className="text-lg lg:text-2xl mb-6 text-white font-semibold">
            BARN: Benefactor for Agricultural Resources and Needs
          </p>
          <button
            onClick={() =>
              donationRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition font-semibold shadow-lg"
          >
            Donate Now
          </button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white/80 backdrop-blur-md" id="about-us">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center mb-6">
            Our Mission & Vision
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 text-center max-w-3xl mx-auto">
            We strive to empower underrepresented communities by providing
            resources, education, and support. Our vision is a world where every
            person has the opportunity to thrive and contribute positively to
            society.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section
        className="py-20 bg-gradient-to-r from-blue-50 via-green-50 to-indigo-100"
        id="services"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center mb-12">
            What We Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: impact1,
                title: "Education Programs",
                desc: "Providing free workshops and materials to help youth succeed in school and career.",
              },
              {
                img: impact2,
                title: "Community Outreach",
                desc: "Partnering with local organizations to deliver food, healthcare, and support to those in need.",
              },
              {
                img: impact3,
                title: "Environmental Stewardship",
                desc: "Organizing clean-ups and awareness campaigns to protect our planet for future generations.",
              },
            ].map((item, index) => (
              <div className="text-center" key={index}>
                <img
                  src={item.img}
                  alt={item.title}
                  className="mx-auto mb-4 rounded-2xl shadow-lg w-48 h-48 object-cover"
                />
                <h3 className="text-2xl font-medium mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/80 backdrop-blur-md" id="team">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Alex Johnson", role: "Founder & CEO", img: team1 },
              { name: "Maria Rodriguez", role: "Head of Outreach", img: team2 },
              { name: "Liu Wei", role: "Education Director", img: team3 },
              { name: "Sara Ahmed", role: "Community Manager", img: team4 },
            ].map((member, idx) => (
              <div className="text-center" key={idx}>
                <img
                  src={member.img}
                  alt={member.name}
                  className="mx-auto rounded-full w-40 h-40 mb-4"
                />
                <h4 className="text-xl font-medium">{member.name}</h4>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section
        ref={donationRef}
        className="py-20 bg-gradient-to-r from-indigo-100 via-blue-50 to-green-100"
        id="contact-us"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center mb-6">
            Get In Touch
          </h2>
          <p className="text-center text-gray-700 mb-8">
            Have questions or want to volunteer? Contact us today!
          </p>

          {formVisible && (
            <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (INR)"
                  className="w-full px-4 py-2 border rounded"
                  min="300"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Donate Money
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer & Razorpay */}
      {/* <Market /> */}
      {/* <Subsidiary /> */}
    </main>
  );
}
