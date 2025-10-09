import { useMapEvents } from 'react-leaflet';

export default function MapController({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });

  return null;
}