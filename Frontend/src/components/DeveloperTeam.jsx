import React from "react";

import group from "../assets/team/group.jpeg";
import subhankar from "../assets/team/subhankar.jpg";
import meenakshi from "../assets/team/meenakshi.jpeg";
import aniketh from "../assets/team/aniketh.jpeg";
import aditya from "../assets/team/aditya.jpeg";
import sivam from "../assets/team/sivam.jpeg";
import anamika from "../assets/team/anamika.png";
import harsha from "../assets/team/harsha.jpeg";
import mentor1 from "../assets/team/mentor1.jpeg";
import mentor2 from "../assets/team/mentor2.jpeg";
import mentor3 from "../assets/team/mentor3.jpeg";

const developers = [
  {
    name: "Subhankar Pandit",
    role: "Backend, Integration and Frontend Enhancements",
    photo: subhankar,
  },
  {
    name: "Tirupate Aniketh",
    role: "Frontend, API and GitHub",
    photo: aniketh,
  },
  {
    name: "Muvva Adityavardhan",
    role: "Chatbot and ML Integration",
    photo: aditya,
  },
  {
    name: "Yakkala Meenakshi",
    role: "Frontend and API",
    photo: meenakshi,
  },
  {
    name: "Sivam Mohapatra",
    role: "Mobile Application and API Integration",
    photo: sivam,
  },
  {
    name: "Anamika Rana",
    role: "Frontend and Presentation",
    photo: anamika,
  },
  {
    name: "Harsha Vardhan",
    role: "Backend and GitHub",
    photo: harsha,
  },
];

const mentors = [
  {
    name: "Mamatha A",
    role: "Vice President - Product & Agile office@ JPMorgan Chase",
    photo: mentor1,
  },
  {
    name: "Srinivas Kota",
    role: "Vice President at JP Morgan Chase",
    photo: mentor2,
  },
  {
    name: "Lavanya Palaparthi",
    role: "Software Engineer lll at JP Morgan Chase",
    photo: mentor3,
  },
];

const DeveloperTeam = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Main Page Title */}
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-800 mb-2">
          Our Amazing Team Behind the Project
        </h1>
        <p className="text-gray-600 text-lg">
          Passion, collaboration, and innovation brought together.
        </p>
      </div>

      {/* Group Photo and Section Title */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <img
          src={group}
          alt="Team Group"
          className="rounded-xl w-full h-auto shadow-md object-cover mb-4"
        />
        <h2 className="text-3xl sm:text-4xl font-bold text-green-700">
          Meet the Developer & Mentor Team
        </h2>
      </div>

      {/* Developer Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Developer Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 text-center"
            >
              <img
                src={dev.photo}
                alt={dev.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {dev.name}
              </h3>
              <p className="text-green-600">{dev.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mentor Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Mentor Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {mentors.map((mentor, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 text-center"
            >
              <img
                src={mentor.photo}
                alt={mentor.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {mentor.name}
              </h3>
              <p className="text-green-600">{mentor.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DeveloperTeam;
