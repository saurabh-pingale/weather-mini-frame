import { createFrames, Button } from "frames.js/next";

export const runtime = "edge";

async function fetchWeatherData() {
  try {
    const locRes = await fetch("http://ip-api.com/json");
    const location = await locRes.json();

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    const weather = await weatherRes.json();

    return {
      temperature: Math.round(weather.main.temp),
      description: weather.weather[0].description,
    };
  } catch (err) {
    console.error("Failed to fetch weather:", err);
    return { temperature: "N/A", description: "Unavailable" };
  }
}

const frames = createFrames({
  basePath: "/frames/weather",
  imagesRoute: "/frames/weather",
});

export const GET = frames(async () => {
  const { temperature, description } = await fetchWeatherData();

  return {
    image: (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "linear-gradient(to right, #4facfe, #00f2fe)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          fontWeight: "bold",
          color: "white",
        }}
      >
        🌤️ {temperature}°C - {description}
      </div>
    ),
    buttons: [<Button action="post">Refresh</Button>],
  };
});

export const POST = frames(async () => {
  const { temperature, description } = await fetchWeatherData();

  return {
    image: (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "linear-gradient(to right, #43e97b, #38f9d7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          fontWeight: "bold",
          color: "white",
        }}
      >
        🔄 {temperature}°C - {description}
      </div>
    ),
    buttons: [<Button action="post">Refresh</Button>],
  };
});