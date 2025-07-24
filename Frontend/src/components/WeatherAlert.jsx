import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const BAD_WEATHER = ['rain', 'storm', 'thunder', 'drizzle', 'snow'];

function isBadWeather(description) {
  return BAD_WEATHER.some(word => description.toLowerCase().includes(word));
}

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function WeatherMap() {
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState([26.2006, 92.9376]); // Assam
  const [loading, setLoading] = useState(false);
  const [isBad, setIsBad] = useState(false);

  const fetchWeatherByCoords = async (lat, lon) => {
    const apiKey = import.meta.env.VITE_WEATHER_API;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const forecasts = res.data.list.filter(f =>
        f.dt_txt.startsWith(tomorrowStr)
      );

      if (forecasts.length > 0) {
        const badForecast = forecasts.find(f =>
          isBadWeather(f.weather[0].description)
        );
        setWeather(badForecast || forecasts[0]);
        setIsBad(!!badForecast);
      } else {
        setWeather(null);
        setIsBad(false);
      }
    } catch (err) {
      setWeather(null);
      setIsBad(false);
    }
    setLoading(false);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        fetchWeatherByCoords(lat, lng);
      },
    });
    return null;
  };

  const renderForecastCard = () => {
    if (loading) {
      return (
        <div className="mt-6 text-lg font-semibold text-gray-600 text-center">
          🔄 Fetching weather data...
        </div>
      );
    }

    if (!weather) return null;

    const { description, icon } = weather.weather[0];
    const formattedTime = new Date(weather.dt_txt).toLocaleString('en-IN', {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });

    return (
      <div className="mt-8 mx-auto max-w-md bg-white border border-green-300 shadow-xl rounded-2xl p-6 text-center transition duration-300 ease-in-out hover:scale-[1.02]">
        <h2 className="text-2xl font-bold text-green-800 mb-4 uppercase tracking-wide">
          Tomorrow's Forecast
        </h2>

        <div className="flex justify-center mb-4">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="weather-icon"
            className="w-20 h-20"
          />
        </div>

        <p className="text-xl capitalize font-semibold text-green-700 mb-1">
          {description}
        </p>
        <p className="text-3xl font-bold text-green-900 mb-2">
          {weather.main.temp}°C
        </p>
        <p className="text-sm text-gray-600">{formattedTime}</p>

        {isBad && (
          <div className="mt-5 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg border border-red-300">
            ⚠️ Bad Weather Expected!
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6 text-center tracking-wide drop-shadow">
        🌤️ Click on the Map to Get Tomorrow's Weather
      </h1>

      <div className="w-full max-w-6xl h-[65vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-green-600">
        <MapContainer
          center={position}
          zoom={6}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
         <TileLayer
          url={`https://api.maptiler.com/maps/winter/256/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_API}`}
          attribution='© <a href="https://www.maptiler.com/">MapTiler</a> & <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
          <Marker position={position} />
        </MapContainer>
      </div>

      {renderForecastCard()}
    </div>
  );
}
