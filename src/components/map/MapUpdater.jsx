import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapUpdater = ({ targetLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (targetLocation) {
      if (targetLocation.bounds) {
        map.fitBounds(targetLocation.bounds, { padding: [50, 50], duration: 1.5 });
      } else {
        map.flyTo(targetLocation.center, targetLocation.zoom, { duration: 1.5 });
      }
    }
  }, [targetLocation, map]);
  return null;
};

export default MapUpdater;