export function getWeatherIcon(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('clear')) return '☀️';
  if (desc.includes('cloud')) return '☁️';
  if (desc.includes('rain')) return '🌧️';
  if (desc.includes('drizzle')) return '🌦️';
  if (desc.includes('thunder') || desc.includes('storm')) return '⛈️';
  if (desc.includes('snow')) return '❄️';
  if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return '🌫️';
  if (desc.includes('tornado')) return '🌪️';
  return '🌤️';
}