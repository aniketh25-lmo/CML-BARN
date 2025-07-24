import React from "react";

const developers = [
 
  {
    name: "Yakkala Meenakshi",
    linkedin: "https://www.linkedin.com/in/meenakshi-yakkala/",
  },
  {
    name: "Tirupate Aniketh",
    linkedin: "https://www.linkedin.com/in/aniketh-tirupate-36666a296/",
  },
   {
    name: "Subhankar Pandit",
    linkedin: "https://www.linkedin.com/in/subhankar-pandit-080449255/",
  },
  {
    name: "Muvva Adityavardhan",
    linkedin: "https://www.linkedin.com/in/madityavardhan/",
  },
  {
    name: "Harsha Vardhan",
    linkedin: "https://www.linkedin.com/in/harsha30/",
  },
  {
    name: "Anamika Rana",
    linkedin: "https://www.linkedin.com/in/anamikarana03/",
  },
  {
    name: "Sivam Mohapatra",
    linkedin: "https://www.linkedin.com/in/sivam-mohapatra-b86907251/",
  },
];

const mentors = [
  {
    name: "Mamatha A",
    linkedin: "https://www.linkedin.com/in/mamta-a/",
  },
  {
    name: "Srinivas Kota",
    linkedin: "https://www.linkedin.com/in/srinivas-kota-767477153/",
  },
  {
    name: "Lavanya Palaparthi",
    linkedin: "https://www.linkedin.com/in/lavanya-palaparthi-61375229/",
  },
];

const Contact = () => {
  const renderSection = (title, members) => (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {members.map((member, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300"
          >
            <p className="text-xl font-semibold mb-2 text-gray-800">
              {member.name}
            </p>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
        Connect with the Team
      </h1>
      {renderSection("Developers", developers)}
      {renderSection("Mentors", mentors)}
    </div>
  );
};

export default Contact;
