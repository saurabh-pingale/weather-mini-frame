import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('q');

  if (!city || city.length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}&limit=5&appid=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const suggestions = data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
    }));

    return NextResponse.json(suggestions);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}