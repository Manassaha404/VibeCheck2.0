"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CITY_COORDINATES: Record<string, [number, number]> = {
  "New York": [40.7128, -74.0060],
  "London": [51.5072, -0.1276],
  "Tokyo": [35.6895, 139.6917],
  "Sydney": [-33.8688, 151.2093],
  "São Paulo": [-23.5505, -46.6333],
  "Paris": [48.8566, 2.3522],
  "Berlin": [52.5200, 13.4050],
  "Los Angeles": [34.0522, -118.2437],
  "Toronto": [43.6510, -79.3470],
  "Mumbai": [19.0760, 72.8777],
  "Singapore": [1.3521, 103.8198],
  "Dubai": [25.2048, 55.2708],
  "Amsterdam": [52.3676, 4.9041],
  "Chicago": [41.8781, -87.6298],
  "San Francisco": [37.7749, -122.4194],
  "Delhi": [28.7041, 77.1025],
  "Bengaluru": [12.9716, 77.5946],
};


const createCustomIcon = (name: string, count: string, heatLevel: number, color: string, shadowColor: string) => {
  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-50%, -50%); pointer-events: none;">
      <div style="
        position: absolute; 
        width: ${heatLevel * 2}px; 
        height: ${heatLevel * 2}px; 
        border-radius: 50%; 
        background: radial-gradient(circle, ${color} 0%, ${shadowColor} 70%); 
        opacity: 0.8;
        animation: pulse 2s infinite;
        z-index: 0;
      "></div>
      <div style="
        width: 14px; 
        height: 14px; 
        border-radius: 50%; 
        background: ${color}; 
        border: 2px solid var(--color-ink-charcoal);
        position: relative;
        z-index: 10;
        box-shadow: 2px 2px 0px 0px var(--color-ink-charcoal);
      "></div>
      <div style="position: relative; z-index: 10; margin-top: 4px; text-align: center; white-space: nowrap;">
        <div style="
          font-family: 'Hanken Grotesk', sans-serif; 
          font-size: 14px; 
          font-weight: 900; 
          color: var(--color-ink-charcoal); 
          text-shadow: 2px 2px 0px var(--color-pure-white), -2px -2px 0px var(--color-pure-white), 2px -2px 0px var(--color-pure-white), -2px 2px 0px var(--color-pure-white);
        ">${name}</div>
        <div style="
          font-family: 'Hanken Grotesk', sans-serif; 
          font-size: 12px; 
          font-weight: 800; 
          color: var(--color-ink-charcoal); 
          background: var(--color-pure-white); 
          border: 2px solid var(--color-ink-charcoal); 
          border-radius: 4px; 
          padding: 0 4px; 
          margin-top: 2px; 
          display: inline-block;
          box-shadow: 2px 2px 0px 0px var(--color-ink-charcoal);
        ">${count}</div>
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

export default function LeafletMap({ topCities = [] }: { topCities?: { city: string, country: string, count: number }[] }) {
  // Map topCities to markers if they exist in our coordinate dictionary
  const markers = topCities
    .map(city => {
      const coords = CITY_COORDINATES[city.city];
      if (!coords) return null; // Skip if we don't have coords for this city
      
      // Calculate heat level based on count (min 10, max 40 for visual scale)
      // This is a simple linear scale assuming count could be anything from 1 to 1000s
      const heatLevel = Math.max(10, Math.min(40, 10 + (city.count * 2)));
      
      return {
        name: `${city.city}, ${city.country}`,
        coordinates: coords,
        count: city.count >= 1000 ? (city.count / 1000).toFixed(1) + 'k' : city.count.toString(),
        heatLevel,
        color: "var(--color-leaf-green)",
        shadowColor: "rgba(142,212,98,0)"
      };
    })
    .filter(Boolean); // Remove nulls

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ width: "100%", height: "100%", background: 'var(--color-canvas-cream)' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {markers.map((marker, i) => (
          <Marker 
            key={i} 
            position={marker!.coordinates as [number, number]} 
            icon={createCustomIcon(marker!.name, marker!.count, marker!.heatLevel, marker!.color, marker!.shadowColor)}
          >
          </Marker>
        ))}
      </MapContainer>
      <style>{`
        .leaflet-container {
          background: var(--color-canvas-cream) !important;
          font-family: 'Hanken Grotesk', sans-serif;
        }
        /* Make the map tiles high contrast and slightly warm to fit the canvas cream vibe */
        .leaflet-tile-pane {
          filter: grayscale(100%) contrast(1.1) sepia(30%) opacity(0.8);
          mix-blend-mode: multiply;
        }
        .custom-leaflet-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-control-zoom a {
          color: var(--color-ink-charcoal) !important;
          border: 2px solid var(--color-ink-charcoal) !important;
          background: var(--color-pure-white) !important;
          box-shadow: 2px 2px 0px 0px var(--color-ink-charcoal) !important;
          border-radius: 0 !important;
          margin-bottom: 8px !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--color-electric-sun) !important;
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0px 0px var(--color-ink-charcoal) !important;
        }
      `}</style>
    </div>
  );
}
