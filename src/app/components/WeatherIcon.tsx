export const getWeatherIcon = (desc: string) => {
  const lowerDesc = desc.toLowerCase();
  if (lowerDesc.includes('rain')) return '🌧️';
  if (lowerDesc.includes('cloud')) return '☁️';
  if (lowerDesc.includes('sun') || lowerDesc.includes('clear')) return '☀️';
  if (lowerDesc.includes('snow')) return '❄️';
  if (lowerDesc.includes('thunder') || lowerDesc.includes('storm')) return '⛈️';
  if (lowerDesc.includes('fog') || lowerDesc.includes('mist')) return '🌫️';
  return '🌤️';
};