'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

type WeatherData = {
  temp: string;
  desc: string;
  city: string;
  country: string;
};

export default function WeatherMiniApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const locRes = await fetch('https://ipwho.is/');
        const loc = await locRes.json();
        console.log ("Location:", loc);

        if (!loc.success || !loc.latitude || !loc.longitude) {
          throw new Error('Could not get location.');
        }

        const weatherRes = await fetch(`/api/weather?lat=${loc.latitude}&lon=${loc.longitude}`);
        const data = await weatherRes.json();

        if (!data.main || !data.weather) {
          throw new Error('Invalid weather response.');
        }

        setWeather({
          temp: `${Math.round(data.main.temp)}°C`,
          desc: data.weather[0].description,
          city: loc.city,
          country: loc.country,
        });
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch weather.');
      } finally {
        await sdk.actions.ready();
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      background: 'linear-gradient(to right, #4facfe, #00f2fe)',
      color: 'white', fontSize: 28, fontWeight: 'bold',
      textAlign: 'center', padding: 20
    }}>
      {error ? (
        <div>{error}</div>
      ) : weather ? (
        <>
          <div style={{ fontSize: 24, marginBottom: 10 }}>📍 {weather.city}, {weather.country}</div>
          <div style={{ fontSize: 48 }}>🌤️ {weather.temp}</div>
          <div style={{ fontSize: 22, marginBottom: 20 }}>{weather.desc}</div>
          <button
            style={{
              padding: '12px 28px',
              fontSize: 18,
              background: '#ffffff33',
              border: 'none',
              borderRadius: 12,
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease'
            }}
            onClick={() => window.location.reload()}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            🔄 Refresh
          </button>
        </>
      ) : (
        <div>Loading weather…</div>
      )}
    </div>
  );
}