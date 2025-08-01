export default function Page() {
  return null;
}

export const metadata = {
  title: 'Weather Mini Frame',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://weather-mini-frame-ten.vercel.app/api/og?city=Weather&country=App&temp=--°C&desc=Select+an+option&icon=🌤️',
    'fc:frame:post_url': 'https://weather-mini-frame-ten.vercel.app/api/frame',
    'fc:frame:button:1': 'Current Weather',
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:2': 'Search City',
    'fc:frame:button:2:action': 'post',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'og:image': 'https://weather-mini-frame-ten.vercel.app/api/og?city=Weather&country=App&temp=--°C&desc=Select+an+option&icon=🌤️',
  }
};