import { useEffect } from "react";
import { useRoadSosStore } from "../store/useRoadSosStore.js";

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 60_000,
  timeout: 20_000
};

const GEOLOCATION_ERROR = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
};

function getLocationErrorMessage(error) {
  if (error?.code === GEOLOCATION_ERROR.PERMISSION_DENIED) {
    return "Location permission was denied. Allow location access in your browser settings and try again.";
  }

  if (error?.code === GEOLOCATION_ERROR.POSITION_UNAVAILABLE) {
    return "Your browser could not determine your desktop location. Check Windows location services and try again.";
  }

  if (error?.code === GEOLOCATION_ERROR.TIMEOUT) {
    return "Location lookup timed out. Move near a window or check your device location settings.";
  }

  return error?.message || "Unable to detect your location.";
}

export function useGeolocation() {
  const setLocation = useRoadSosStore((state) => state.setLocation);
  const setLocationStatus = useRoadSosStore((state) => state.setLocationStatus);

  useEffect(() => {
    let cancelled = false;
    let watchId;

    if (!("geolocation" in navigator)) {
      setLocationStatus("blocked", "Geolocation is not supported by this browser.");
      return undefined;
    }

    if (!window.isSecureContext) {
      setLocationStatus("blocked", "Location access requires HTTPS or localhost.");
      return undefined;
    }

    const updateLocation = (position) => {
      if (cancelled) return;
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        updatedAt: new Date().toISOString()
      });
    };

    const updateError = (error) => {
      if (cancelled) return;
      setLocationStatus("blocked", getLocationErrorMessage(error));
    };

    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position);
        if (cancelled) return;
        watchId = navigator.geolocation.watchPosition(updateLocation, updateError, GEOLOCATION_OPTIONS);
      },
      updateError,
      GEOLOCATION_OPTIONS
    );

    return () => {
      cancelled = true;
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, [setLocation, setLocationStatus]);
}
