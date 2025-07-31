export const metadata = {
  title: 'Weather Mini Frame',
  description: 'Farcaster Weather Frame',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}