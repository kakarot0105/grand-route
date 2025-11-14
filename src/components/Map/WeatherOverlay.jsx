import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { useAlongRouteWeather } from '../../hooks/useAlongRouteWeather.js';

function WeatherOverlayContent({ route }) {
  const map = useMap();
  const { samples } = useAlongRouteWeather(route, 50); // Fetch weather every 50km
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const rerender = () => forceUpdate((n) => n + 1);
    map.on('move zoom', rerender);
    return () => map.off('move zoom', rerender);
  }, [map]);

  if (!samples.length) return null;

  return (
    <div className="pointer-events-none">
      {samples.map((sample, i) => {
        if (!sample.weather) return null;

        const point = map.latLngToContainerPoint([sample.lat, sample.lon]);
        const iconUrl = sample.weather.icon && typeof sample.weather.icon === 'string'
          ? `https://openweathermap.org/img/wn/${sample.weather.icon}@2x.png`
          : null;

        return (
          <motion.div
            key={`${sample.lat}-${sample.lon}-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ transform: `translate(${point.x}px, ${point.y}px)` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, zIndex: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-1 px-2 py-1 rounded-full shadow-lg bg-white/80 backdrop-blur-sm border border-white/50">
              {iconUrl ? (
                <img src={iconUrl} alt={sample.weather.description} className="w-6 h-6" />
              ) : (
                <span className="text-xl">🌤️</span>
              )}
              <span className="font-bold text-gray-800">{Math.round(sample.weather.temp)}°C</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function WeatherOverlay({ route }) {
  return <WeatherOverlayContent route={route} />;
}
