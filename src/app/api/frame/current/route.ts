import { getWeatherIcon } from '@/app/components/WeatherIcon';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Get approximate location from IP
    const locRes = await fetch('https://ipwho.is/');
    const loc = await locRes.json();

    if (!loc.success) {
      throw new Error('Could not detect location');
    }

    // Fetch weather for current location
    const weatherRes = await fetch(`https://weather-mini-frame-ten.vercel.app/api/weather?lat=${loc.latitude}&lon=${loc.longitude}`);
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      throw new Error('Weather data unavailable');
    }

    // Generate weather image
    const weatherImageUrl = await generateWeatherImage(weatherData);
    
    return new NextResponse(getFrameHtml({
      imageUrl: weatherImageUrl,
      postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame',
      buttons: [
        { label: 'Current Weather', action: 'post' },
        { label: 'Search City', action: 'post' }
      ]
    }), {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error: any) {
    return new NextResponse(getFrameHtml({
      imageUrl: 'https://weather-mini-frame-ten.vercel.app/error-image.png',
      postUrl: 'https://weather-mini-frame-ten.vercel.app/api/frame',
      buttons: [
        { label: 'Try Again', action: 'post' },
        { label: 'Search City', action: 'post' }
      ],
      error: error.message || 'Failed to fetch weather'
    }), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

// Reuse the same generateWeatherImage and getFrameHtml functions
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