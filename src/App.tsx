import { useState } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
    <div className="flex h-full w-full">
      <Sidebar onLocationSelect={setSelectedLocation} />
      <div className="map-container">
        <MapView selectedLocation={selectedLocation} />
      </div>
    </div>
  );
}

export default App;
