'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { getWeatherIcon } from '@/app/components/WeatherIcon';
import NavigationButtons from '@/app/components/NavigationButtons';
import { WeatherData } from '@/app/types';
import '@/app/styles/weather.css';

export default function WeatherMiniApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const locRes = await fetch('https://ipwho.is/');
      const loc = await locRes.json();

      if (!loc.success || !loc.latitude || !loc.longitude) {
        throw new Error('Could not get location.');
      }

      const weatherRes = await fetch(`/api/weather?lat=${loc.latitude}&lon=${loc.longitude}`);
      const data = await weatherRes.json();

      if (!data.main || !data.weather) {
        throw new Error('Invalid weather response.');
      }

      const weatherDesc = data.weather[0].description;
      
      setWeather({
        temp: `${Math.round(data.main.temp)}°C`,
        desc: weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1),
        city: loc.city,
        country: loc.country,
        icon: getWeatherIcon(weatherDesc),
        feels_like: `${Math.round(data.main.feels_like)}°C`,
        humidity: `${data.main.humidity}%`,
        wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
      });
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
      await sdk.actions.ready();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="weather-app weather-gradient-bg" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '1rem',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <NavigationButtons
        buttons={[
          { emoji: '🏠', label: 'Home', path: '/frames/weather' },
          { emoji: '🔍', label: 'Search', path: '/frames/weather/search' }
        ]}
      />

      {loading ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '600px'
        }}>
          <div className="loading-spinner" style={{ 
            width: '3rem', 
            height: '3rem', 
            marginBottom: '1rem' 
          }}></div>
          <p style={{ fontSize: 'clamp(1rem, 5vw, 1.25rem)' }}>Detecting your location...</p>
        </div>
      ) : error ? (
        <div className="weather-card fade-in" style={{
          padding: '1.25rem',
          width: '100%',
          maxWidth: '600px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h2 style={{ 
            fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem' 
          }}>
            Error
          </h2>
          <p style={{ marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="weather-button"
            style={{ fontWeight: 500, width: '100%' }}
          >
            Try Again
          </button>
        </div>
      ) : weather ? (
        <div className="weather-card fade-in" style={{
          padding: '1.5rem',
          width: '100%',
          maxWidth: '600px'
        }}>
          <div style={{ 
            fontSize: 'clamp(1.75rem, 8vw, 2rem)', 
            marginBottom: '0.25rem' 
          }}>
            {weather.icon}
          </div>
          <h1 style={{ 
            fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '0.25rem' 
          }}>
            {weather.city}, {weather.country}
          </h1>
          <p style={{ 
            fontSize: 'clamp(0.875rem, 4vw, 1rem)', 
            opacity: 0.8, 
            marginBottom: '1rem' 
          }}>
            Current Weather
          </p>
          
          <div style={{ 
            fontSize: 'clamp(2.5rem, 12vw, 3.75rem)', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem' 
          }}>
            {weather.temp}
          </div>
          <p style={{ 
            fontSize: 'clamp(1rem, 5vw, 1.25rem)', 
            marginBottom: '1rem', 
            textTransform: 'capitalize' 
          }}>
            {weather.desc}
          </p>
          
          <div className="weather-stats-grid" style={{ marginBottom: '1.5rem' }}>
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
          
          <button
            onClick={() => window.location.reload()}
            className="weather-button"
            style={{
              fontWeight: 500,
              padding: '0.75rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🔄</span> Refresh Weather
          </button>
        </div>
      ) : null}
    </div>
  );
}