export const metadata = {
  title: 'Weather Mini Frame',
  description: 'Farcaster Weather Frame',
  openGraph: {
    images: ['https://weather-mini-frame-ten.vercel.app/og-image.png']
  },
  other: {
  'fc:frame': 'vNext',
  'fc:frame:image': 'https://weather-mini-frame-ten.vercel.app/og-image.png',
  'fc:frame:post_url': 'https://weather-mini-frame-ten.vercel.app/api/frame',
  'fc:frame:button:1': 'Current Weather',
  'fc:frame:button:1:action': 'post',
  'fc:frame:button:2': 'Search City',
  'fc:frame:button:2:action': 'post',
  'fc:frame:image:aspect_ratio': '1.91:1'
}
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="https://weather-mini-frame-ten.vercel.app/og-image.png" />
        <meta property="og:title" content="Weather Mini Frame" />
        <meta property="og:description" content="Get real-time weather updates" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://weather-mini-frame-ten.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>{children}</body>
    </html>
  );
}