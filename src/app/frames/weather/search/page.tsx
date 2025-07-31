'use client';

import { useEffect, useState } from 'react';
import { getWeatherIcon } from '@/app/components/WeatherIcon';
import NavigationButtons from '@/app/components/NavigationButtons';
import { WeatherData } from '@/app/types';
import '@/app/styles/weather.css';

export default function CitySearchWeather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ name: string; country: string; state?: string }[]>([]);
  const [debouncedCity, setDebouncedCity] = useState(city);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCity(city);
    }, 300);
    return () => clearTimeout(handler);
  }, [city]);

  const fetchSuggestions = async () => {
    const res = await fetch(`/api/cities?q=${encodeURIComponent(debouncedCity)}`);
    const data = await res.json();
    setSuggestions(data);
  };

  useEffect(() => {
    if (debouncedCity.length < 2) {
      setSuggestions([]);
      return;
    }
    fetchSuggestions();
  }, [debouncedCity]);

  const handleSuggestionClick = (name: string) => {
    setCity(name);
    setSuggestions([]);
    fetchWeather();
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (res.status !== 200 || data.cod !== 200) {
        throw new Error(data.message || 'City not found');
      }

      const weatherDesc = data.weather[0].description;
      
      setWeather({
        temp: `${Math.round(data.main.temp)}°C`,
        desc: weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1),
        city: data.name,
        country: data.sys.country,
        icon: getWeatherIcon(weatherDesc),
        feels_like: `${Math.round(data.main.feels_like)}°C`,
        humidity: `${data.main.humidity}%`,
        wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
      });
    } catch (err: any) {
      setError(err.message || 'City not found or error fetching weather.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app weather-gradient-bg" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '1rem',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      <NavigationButtons
        buttons={[
          { emoji: '🏠', label: 'Home', path: '/frames/weather' },
          { emoji: '📍', label: 'Current', path: '/frames/weather/current' }
        ]}
      />

      <div style={{ width: '100%', maxWidth: '600px', position: 'relative', marginTop: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 1.875rem)', fontWeight: 'bold', marginBottom: '0.5rem' }}>🔍 Search Weather</h1>
          <p style={{ fontSize: 'clamp(0.875rem, 4vw, 1rem)', opacity: 0.8 }}>Enter any city name to get current weather</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="e.g. New York, Tokyo, London..."
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchWeather()}
              className="weather-input"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(s.name)}
                    className="suggestion-item"
                  >
                    {s.name}, {s.state ? `${s.state}, ` : ''}{s.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="weather-button"
          >
            {loading ? (
              <div className="loading-spinner" style={{ width: '1.25rem', height: '1.25rem' }}></div>
            ) : 'Search'}
          </button>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: 'rgb(254, 226, 226)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {weather && (
          <div className="weather-card fade-in" style={{
            marginTop: '1.5rem',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(1rem, 5vw, 1.25rem)', fontWeight: 'bold' }}>{weather.city}, {weather.country}</h2>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Current Weather</p>
              </div>
              <div style={{ fontSize: '2rem' }}>{weather.icon}</div>
            </div>
            
            <div style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', fontWeight: 'bold', margin: '1rem 0' }}>{weather.temp}</div>
            <p style={{ fontSize: 'clamp(1rem, 5vw, 1.125rem)', textTransform: 'capitalize', marginBottom: '1.5rem' }}>{weather.desc}</p>
            
            <div className="weather-stats-grid">
              <div className="weather-stats-item">
                <div>🌡️ Feels like</div>
                <div style={{ fontWeight: 600 }}>{weather.feels_like}</div>
              </div>
              <div className="weather-stats-item">
                <div>💧 Humidity</div>
                <div style={{ fontWeight: 600 }}>{weather.humidity}</div>
              </div>
              <div className="weather-stats-item">
                <div>🌬️ Wind</div>
                <div style={{ fontWeight: 600 }}>{weather.wind}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}