import { useState, useEffect } from 'react';

type Position = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
};

export const usePosition = (settings = defaultSettings) => {
  const [position, setPosition] = useState<Position>();
  const [error, setError] = useState<string>();

  const onChange = ({ coords, timestamp }: GeolocationPosition) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp,
    });
  };

  const onError = (positionError: GeolocationPositionError) => {
    setError(positionError.message);
  };

  useEffect(() => {
    if (!navigator || !navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(onChange, onError, settings);
  }, [settings]);

  return [position, error] as const;
};
