'use client';

import { useRouter } from 'next/navigation';
import { NavigationButtonsProps } from '../types';
import '@/app/styles/weather.css';

export default function NavigationButtons({ buttons, className = '' }: NavigationButtonsProps) {
  const router = useRouter();

  return (
    <div className={`nav-buttons ${className}`} style={{
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      right: '1rem',
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      paddingBottom: '1.5rem',
      zIndex: 10
    }}>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => router.push(button.path)}
          className="weather-button nav-button"
        >
          {button.emoji} {button.label}
        </button>
      ))}
    </div>
  );
}