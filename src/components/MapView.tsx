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

interface MapViewProps {
    selectedLocation: any;
}

// SIT Tumkur Coordinates
const CENTER_LAT = 13.3269;
const CENTER_LNG = 77.1261;
const ZOOM_LEVEL = 17; // Increased zoom for satellite view

// Campus Bounds (Approximate based on GeoJSON)
const CAMPUS_BOUNDS = L.latLngBounds(
    [13.3210, 77.1200], // South-West
    [13.3350, 77.1350]  // North-East
);

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
            show: false // Hide the itinerary container if desired
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, start, end]);

    return null;
}

export default function MapView({ selectedLocation }: MapViewProps) {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    // Default start point: Administrative Block
    const [startPoint] = useState<[number, number]>([13.3269, 77.1261]);

    useEffect(() => {
        // Load GeoJSON data
        setGeoJsonData(campusPaths);
    }, []);

    return (
        <MapContainer
            center={[CENTER_LAT, CENTER_LNG]}
            zoom={ZOOM_LEVEL}
            minZoom={15}
            maxBounds={CAMPUS_BOUNDS}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {/* Render Paths from GeoJSON */}
            {geoJsonData && geoJsonData.features.map((feature: any, index: number) => {
                if (feature.geometry.type === 'LineString') {
                    // GeoJSON coordinates are [lng, lat], Leaflet needs [lat, lng]
                    const positions = feature.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
                    return <Polyline key={index} positions={positions} color="#facc15" weight={4} opacity={0.8} />;
                }
                return null;
            })}

            {selectedLocation && (
                <>
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                        <Popup>
                            <div className="font-bold">{selectedLocation.name}</div>
                            <div className="text-sm">{selectedLocation.category}</div>
                        </Popup>
                    </Marker>
                    <Routing start={startPoint} end={[selectedLocation.lat, selectedLocation.lng]} />
                </>
            )}
        </MapContainer>
    );
}
