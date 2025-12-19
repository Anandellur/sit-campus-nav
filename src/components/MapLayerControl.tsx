import { Layers } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export type MapLayer = 'satellite' | 'standard';

interface MapLayerControlProps {
    currentLayer: MapLayer;
    onLayerChange: (layer: MapLayer) => void;
}

export default function MapLayerControl({ currentLayer, onLayerChange }: MapLayerControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const layers: { id: MapLayer; label: string; previewColor: string }[] = [
        { id: 'satellite', label: 'Satellite', previewColor: '#1a73e8' }, // Blueish for satellite
        { id: 'standard', label: 'Standard', previewColor: '#fbbc04' },  // Yellowish for streets
    ];

    return (
        <div className="layer-control-container" ref={menuRef}>
            <button
                className={`layer-toggle-button ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Change Map Layers"
            >
                <Layers size={24} />
            </button>

            {isOpen && (
                <div className="layer-menu">
                    <div className="layer-menu-header">Map Type</div>
                    <div className="layer-options">
                        {layers.map((layer) => (
                            <button
                                key={layer.id}
                                className={`layer-option ${currentLayer === layer.id ? 'selected' : ''}`}
                                onClick={() => {
                                    onLayerChange(layer.id);
                                    setIsOpen(false);
                                }}
                            >
                                <div
                                    className="layer-preview"
                                    style={{ backgroundColor: layer.previewColor }}
                                >
                                    {/* Placeholder for actual image preview if we had them */}
                                </div>
                                <span className="layer-label">{layer.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
