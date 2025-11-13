# GRAND ROUTE — Epic Journey Planner

Anime-themed weather and route planning app with RPG quest system.

This repository contains a production-ready React (Vite) frontend scaffold for GRAND ROUTE, including:

- Leaflet map with route drawing (Mapbox/OSRM)
- OpenWeatherMap/Open‑Meteo weather integration (current + hourly)
- Quest planner with route types and preferences
- React Router navigation and basic pages
- React Query for data fetching/caching
- PWA (manifest + service worker) and Netlify config
- Styled anime aesthetic with the specified color palette

## Quick start

1) Install dependencies

```
npm install
```

2) Configure environment variables (copy `.env.example` to `.env`)

```
VITE_OPENWEATHER_KEY=your_openweather_key
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_API_BASE_URL=https://your-backend.example.com
```

3) Run locally

```
npm run dev
```

4) Build for production

```
npm run build
```

## Project structure

```
public/            # index.html, manifest.json, service-worker.js
src/
  components/      # Header, QuestPlanner, MapView, WeatherWidget
  pages/           # Home, Dashboard, Profile, Community, Leaderboard, Settings
  hooks/           # useGeolocation, useWeather
  context/         # AuthContext, QuestContext
  services/        # weather, maps (Mapbox/OSRM), polyline decoder
  styles/          # global styles, themes, animations
  utils/           # constants, calculations
  App.jsx, index.jsx
```

## Notes

- Map routing uses Mapbox Directions API when `VITE_MAPBOX_TOKEN` is provided. Otherwise falls back to OSRM public server.
- Weather integrates with OpenWeatherMap when `VITE_OPENWEATHER_KEY` is set. Otherwise falls back to Open‑Meteo.
- Netlify config is in `netlify.toml` with SPA redirects and Vite build.
- This is a foundation. Advanced features (auth backend, social, gamification depth, AR, etc.) are scaffold-ready but not implemented in this initial drop.
