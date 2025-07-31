'use client';

import { useRouter } from 'next/navigation';
import '@/app/styles/weather.css';

export default function WeatherHome() {
  const router = useRouter();

  return (
    <div className="weather-app weather-gradient-bg" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      gap: '2rem',
      padding: '1rem',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: '600px' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', fontWeight: 'bold', marginBottom: '0.5rem' }}>🌦️ Weather Assistant</h1>
        <p style={{ fontSize: 'clamp(0.875rem, 4vw, 1.125rem)', opacity: 0.8 }}>Get real-time weather updates anywhere</p>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        maxWidth: '600px'
      }}>
        <div
          onClick={() => router.push('/frames/weather/current')}
          className="weather-card"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>📍</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Current Location</h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.75rem' }}>Get weather based on your current location</p>
          <div className="tag">Automatic detection</div>
        </div>

        <div
          onClick={() => router.push('/frames/weather/search')}
          className="weather-card"
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Search City</h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.75rem' }}>Enter a city name to get weather info</p>
          <div className="tag">Worldwide coverage</div>
        </div>
      </div>
      
      <div style={{ fontSize: '0.75rem', opacity: 0.6, animation: 'pulse 2s infinite' }}>Select an option to continue</div>
    </div>
  );
}