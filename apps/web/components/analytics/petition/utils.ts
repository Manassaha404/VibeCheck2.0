import L from 'leaflet';
import { useMap } from 'react-leaflet/hooks';


export const createCustomIcon = (name: string, count: string, heatLevel: number, color: string, shadowColor: string) => {
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

