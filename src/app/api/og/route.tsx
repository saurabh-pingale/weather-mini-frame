import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import React from 'react';

export const runtime = 'edge';

interface WeatherImageParams {
  city: string | null;
  country: string | null;
  temp: string | null;
  desc: string | null;
  icon: string | null;
  feelsLike: string | null;
  humidity: string | null;
  wind: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params: WeatherImageParams = {
      city: searchParams.get('city'),
      country: searchParams.get('country'),
      temp: searchParams.get('temp'),
      desc: searchParams.get('desc'),
      icon: searchParams.get('icon'),
      feelsLike: searchParams.get('feelsLike'),
      humidity: searchParams.get('humidity'),
      wind: searchParams.get('wind')
    };

    const city = params.city || 'Unknown Location';
    const country = params.country || '';
    const temp = params.temp || '--°C';
    const desc = params.desc || 'Weather data unavailable';
    const icon = params.icon || '🌤️';
    const feelsLike = params.feelsLike || '--°C';
    const humidity = params.humidity || '--%';
    const wind = params.wind || '-- km/h';

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 50%, #06b6d4 100%)',
      color: 'white',
      padding: '40px',
      fontFamily: 'sans-serif',
    };

    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    };

    const titleStyle: React.CSSProperties = {
      fontSize: '48px',
      marginBottom: '8px'
    };

    const subtitleStyle: React.CSSProperties = {
      fontSize: '24px',
      opacity: 0.8
    };

    const iconStyle: React.CSSProperties = {
      fontSize: '64px'
    };

    const tempStyle: React.CSSProperties = {
      fontSize: '96px',
      fontWeight: 'bold',
      margin: '40px 0'
    };

    const descStyle: React.CSSProperties = {
      fontSize: '36px',
      textTransform: 'capitalize',
      marginBottom: '40px'
    };

    const statsContainerStyle: React.CSSProperties = {
      display: 'flex',
      gap: '20px'
    };

    const statItemStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column'
    };

    const statLabelStyle: React.CSSProperties = {
      fontSize: '20px'
    };

    const statValueStyle: React.CSSProperties = {
      fontSize: '24px',
      fontWeight: 600
    };

    return new ImageResponse(
      (
        <div style={containerStyle}>
          <div style={headerStyle}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={titleStyle}>
                {city}, {country}
              </h1>
              <p style={subtitleStyle}>Current Weather</p>
            </div>
            <div style={iconStyle}>{icon}</div>
          </div>
          
          <div style={tempStyle}>
            {temp}
          </div>
          <p style={descStyle}>
            {desc}
          </p>
          
          <div style={statsContainerStyle}>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>🌡️ Feels like</span>
              <span style={statValueStyle}>{feelsLike}</span>
            </div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>💧 Humidity</span>
              <span style={statValueStyle}>{humidity}</span>
            </div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>🌬️ Wind</span>
              <span style={statValueStyle}>{wind}</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response('Failed to generate image', { status: 500 });
  }
}