import { getWeatherIcon } from '@/app/components/WeatherIcon';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const inputText = data.untrustedData?.inputText;
    
    if (!inputText) {
      return new NextResponse(getFrameHtml({
        imageUrl: 'https://weather-mini-frame-ten.vercel.app/api/og?city=Search&country=Weather&temp=--°C&desc=Enter+city+name&icon=🔍',
        postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame/search',
        inputText: 'Enter city name (e.g. New York)',
        buttons: [{ label: 'Search', action: 'post' }],
        error: 'Please enter a city name'
      }), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const weatherRes = await fetch(`https://weather-mini-frame-ten.vercel.app/api/weather?city=${encodeURIComponent(inputText)}`);
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      return new NextResponse(getFrameHtml({
        imageUrl: 'https://weather-mini-frame-ten.vercel.app/api/og?city=Error&country=--&temp=--°C&desc=City+not+found&icon=⚠️',
        postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame/search',
        inputText: 'Enter city name (e.g. New York)',
        buttons: [{ label: 'Try Again', action: 'post' }],
        error: weatherData.message || 'City not found'
      }), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const weatherImageUrl = await generateWeatherImage(weatherData);
    
    return new NextResponse(getFrameHtml({
      imageUrl: weatherImageUrl,
      postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame',
      buttons: [
        { label: 'Current Weather', action: 'post' },
        { label: 'Search Again', action: 'post' }
      ]
    }), {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error: any) {
    return new NextResponse(getFrameHtml({
      imageUrl: 'https://weather-mini-frame-ten.vercel.app/api/og?city=Error&country=--&temp=--°C&desc=Search+failed&icon=⚠️',
      postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame/search',
      inputText: 'Enter city name (e.g. New York)',
      buttons: [{ label: 'Try Again', action: 'post' }],
      error: error.message || 'Failed to fetch weather'
    }), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

async function generateWeatherImage(weatherData: any): Promise<string> {
  const params = new URLSearchParams({
    city: weatherData.name,
    country: weatherData.sys?.country || '',
    temp: `${Math.round(weatherData.main.temp)}°C`,
    desc: weatherData.weather[0]?.description || '',
    icon: getWeatherIcon(weatherData.weather[0]?.description || ''),
    feelsLike: `${Math.round(weatherData.main.feels_like)}°C`,
    humidity: `${weatherData.main.humidity}%`,
    wind: `${Math.round((weatherData.wind.speed || 0) * 3.6)} km/h`
  });

  return `https://weather-mini-frame-ten.vercel.app/api/og?${params.toString()}`;
}

function getFrameHtml(options: {
  imageUrl: string;
  postUrl: string;
  buttons?: Array<{ label: string; action?: string }>;
  inputText?: string;
  error?: string;
}) {
  const buttonsHtml = options.buttons?.map((button, i) => 
    `<meta property="fc:frame:button:${i + 1}" content="${button.label}" />
     <meta property="fc:frame:button:${i + 1}:action" content="${button.action || 'post'}" />`
  ).join('') || '';

  const inputHtml = options.inputText ? 
    `<meta property="fc:frame:input:text" content="${options.inputText}" />` : '';

  return `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${options.imageUrl}" />
        <meta property="fc:frame:post_url" content="${options.postUrl}" />
        ${inputHtml}
        ${buttonsHtml}
        <meta property="og:image" content="${options.imageUrl}" />
      </head>
    </html>`;
}