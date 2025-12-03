import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useEffect, useState } from 'react';
import campusPaths from '../data/campus-paths.json';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom User Location Icon
const UserLocationIcon = L.divIcon({
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

interface MapViewProps {
    selectedLocation: any;
    userLocation: [number, number] | null;
    onMapReady?: () => void;
}

// SIT Tumkur Coordinates
const CENTER_LAT = 13.3269;
const CENTER_LNG = 77.1261;
const ZOOM_LEVEL = 17;

// Campus Bounds
const CAMPUS_BOUNDS = L.latLngBounds(
    [13.3210, 77.1200], // South-West
    [13.3350, 77.1350]  // North-East
);

// Map Center Controller
function MapController({ center, zoom }: { center: [number, number] | null, zoom?: number }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || map.getZoom(), {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [center, zoom, map]);

    return null;
}

// Routing Component
function Routing({ start, end }: { start: L.LatLngExpression, end: L.LatLngExpression }) {
    const map = useMap();

    useEffect(() => {
        if (!start || !end) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start as any),
                L.latLng(end as any)
            ],
            routeWhileDragging: true,
            showAlternatives: false,
            fitSelectedRoutes: true,
            show: false
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, start, end]);

    return null;
}

export default function MapView({ selectedLocation, userLocation, onMapReady }: MapViewProps) {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

    useEffect(() => {
        // Load GeoJSON data
        setGeoJsonData(campusPaths);
        if (onMapReady) {
            onMapReady();
        }
    }, [onMapReady]);

    // Update map center when user location or selected location changes
    useEffect(() => {
        if (selectedLocation) {
            setMapCenter([selectedLocation.lat, selectedLocation.lng]);
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (userLocation) {
            setMapCenter(userLocation);
        }
    }, [userLocation]);

    return (
        <MapContainer
            center={[CENTER_LAT, CENTER_LNG]}
            zoom={ZOOM_LEVEL}
            minZoom={15}
            maxBounds={CAMPUS_BOUNDS}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
        >
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {/* Map Controller for smooth centering */}
            <MapController center={mapCenter} zoom={17} />

            {/* Render Paths from GeoJSON */}
            {geoJsonData && geoJsonData.features.map((feature: any, index: number) => {
                if (feature.geometry.type === 'LineString') {
                    const positions = feature.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
                    return <Polyline key={index} positions={positions} color="#facc15" weight={4} opacity={0.8} />;
                }
                return null;
            })}

            {/* User Location Marker */}
            {userLocation && (
                <Marker position={userLocation} icon={UserLocationIcon}>
                    <Popup>
                        <div className="popup-title">Your Location</div>
                        <div className="popup-category">Current Position</div>
                    </Popup>
                </Marker>
            )}

            {/* Selected Location Marker and Routing */}
            {selectedLocation && (
                <>
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                        <Popup>
                            <div className="popup-title">{selectedLocation.name}</div>
                            <div className="popup-category">{selectedLocation.category}</div>
                        </Popup>
                    </Marker>
                    {userLocation && (
                        <Routing start={userLocation} end={[selectedLocation.lat, selectedLocation.lng]} />
                    )}
                </>
            )}
        </MapContainer>
    );
}
