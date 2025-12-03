import { useState, useCallback } from 'react';
import MapView from './components/MapView';
import SearchBar from './components/Sidebar';
import LocationButton from './components/LocationButton';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationActive, setLocationActive] = useState(false);

  const handleGetUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLocationActive(true);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return (
    <div className="w-full h-full">
      <SearchBar onLocationSelect={setSelectedLocation} />
      <div className="map-container">
        <MapView
          selectedLocation={selectedLocation}
          userLocation={userLocation}
        />
      </div>
      <LocationButton
        onClick={handleGetUserLocation}
        loading={isLocating}
        active={locationActive}
      />
    </div>
  );
}

export default App;
