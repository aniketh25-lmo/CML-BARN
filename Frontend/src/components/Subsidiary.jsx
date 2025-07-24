// src/Subsidiary.jsx
import React, { useState } from 'react';

// This component expects iconPaths, schemes, and assamDistricts as props
const Subsidiary = ({ iconPaths, schemes, assamDistricts }) => {
  // Form states
  const [farmerName, setFarmerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [interestedSchemes, setInterestedSchemes] = useState([]);
  const [consent, setConsent] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const handleSchemeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setInterestedSchemes([...interestedSchemes, value]);
    } else {
      setInterestedSchemes(interestedSchemes.filter(schemeId => schemeId !== value));
    }
  };

  const handleFarmerSubmit = (event) => {
    event.preventDefault();
    setFormSubmitting(true);
    setFormMessage({ type: '', text: '' });

    if (!consent) {
      setFormMessage({ type: 'error', text: 'Please provide consent to be contacted.' });
      setFormSubmitting(false);
      return;
    }

    // Simulate form submission without a backend
    console.log("Farmer Data Captured (Frontend Only):", {
      farmerName,
      contactNumber,
      district,
      village,
      interestedSchemes,
      consent,
      timestamp: new Date().toISOString()
    });

    setFormMessage({ type: 'success', text: 'किसान का विवरण सफलतापूर्वक दर्ज किया गया है! हम जल्द ही संपर्क करेंगे। / Farmer details submitted successfully! We will contact soon.' });

    // Clear form after simulated submission
    setFarmerName('');
    setContactNumber('');
    setDistrict('');
    setVillage('');
    setInterestedSchemes([]);
    setConsent(false);

    setFormSubmitting(false);
  };

  return (
    <section className="bg-white p-6 md:p-8 mb-6 rounded-lg shadow-md">
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-4">किसान पंजीकरण: सहायता प्राप्त करें</h2>
      <h3 className="text-xl md:text-2xl font-semibold text-blue-700 text-center mb-6">Farmer Registration: Get Assistance</h3>
      <div className="text-center">
        {/* <img src={iconPaths.register} alt="Register Icon" className="w-20 h-20 mx-auto mb-4 rounded-full" /> */}
        <p className="text-gray-700 mb-4">यदि आपको योजनाओं में नामांकन के लिए सहायता चाहिए, तो कृपया अपना विवरण नीचे दर्ज करें। हमारे स्वयंसेवक/अधिकारी आपसे संपर्क करेंगे।</p>
        <p className="text-gray-700 mb-6">If you need assistance with enrolling in schemes, please enter your details below. Our volunteers/officials will contact you.</p>

        <form onSubmit={handleFarmerSubmit} className="flex flex-col items-center">
          <div className="w-full max-w-md mb-4 text-left">
            <label htmlFor="farmerName" className="block text-gray-700 text-sm font-semibold mb-2">किसान का नाम / Farmer's Name:</label>
            <input
              type="text"
              id="farmerName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              required
            />
          </div>

          <div className="w-full max-w-md mb-4 text-left">
            <label htmlFor="contactNumber" className="block text-gray-700 text-sm font-semibold mb-2">संपर्क नंबर / Contact Number:</label>
            <input
              type="tel"
              id="contactNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              pattern="[0-9]{10}"
              placeholder="10-digit number"
              required
            />
          </div>

          <div className="w-full max-w-md mb-4 text-left">
            <label htmlFor="district" className="block text-gray-700 text-sm font-semibold mb-2">जिला (असम) / District (Assam):</label>
            <select
              id="district"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            >
              <option value="">एक जिला चुनें / Select a District</option>
              {assamDistricts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div className="w-full max-w-md mb-4 text-left">
            <label htmlFor="village" className="block text-gray-700 text-sm font-semibold mb-2">गाँव / Village:</label>
            <input
              type="text"
              id="village"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
            />
          </div>

          <div className="w-full max-w-md mb-4 text-left">
            <label className="block text-gray-700 text-sm font-semibold mb-2">रुचि रखने वाली योजनाएं (एक या अधिक चुनें) / Interested Schemes (Select one or more):</label>
            <div className="flex flex-col space-y-2">
              {schemes.map(scheme => (
                <div key={scheme.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`scheme-${scheme.id}`}
                    value={scheme.id}
                    checked={interestedSchemes.includes(scheme.id)}
                    onChange={handleSchemeChange}
                    className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor={`scheme-${scheme.id}`} className="ml-2 text-gray-700 text-base">{scheme.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md mb-6 text-left flex items-center">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="consent" className="ml-2 text-gray-700 text-sm">मैं सहमत हूं कि मेरे विवरण का उपयोग सरकारी योजनाओं के लिए मुझसे संपर्क करने के लिए किया जा सकता है। / I consent for my details to be used to contact me regarding government schemes.</label>
          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={formSubmitting}
          >
            {formSubmitting ? 'भेजा जा रहा है... / Submitting...' : 'विवरण भेजें / Submit Details'}
          </button>

          {formMessage.text && (
            <p
              className={`mt-4 p-3 rounded-md text-sm font-semibold w-full max-w-md ${
                formMessage.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-400'
                  : 'bg-red-100 text-red-700 border border-red-400'
              }`}
            >
              {formMessage.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Subsidiary;