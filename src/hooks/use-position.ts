import { useState, useEffect } from 'react';

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
};

export const usePosition = (settings = defaultSettings) => {
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  }>();
  const [error, setError] = useState<string>();

  const onChange = ({ coords, timestamp }: Position) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp,
    });
  };

  const onError = (positionError: PositionError) => {
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
