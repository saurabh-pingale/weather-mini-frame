export type WeatherData = {
  temp: string;
  desc: string;
  city: string;
  country: string;
  icon: string;
  feels_like: string;
  humidity: string;
  wind: string;
};

type NavigationButton = {
  emoji: string;
  label: string;
  path: string;
};

export type NavigationButtonsProps = {
  buttons: NavigationButton[];
  className?: string;
};